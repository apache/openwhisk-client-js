/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict'

const messages = require('./messages')
const OpenWhiskError = require('./openwhisk_error')
const needle = require('needle')
const url = require('url')
const http = require('http')
const retry = require('async-retry')

/**
 * This implements a request-promise-like facade over the needle
 * library. There are two gaps between needle and rp that need to be
 * bridged: 1) convert `qs` into a query string; and 2) convert
 * needle's non-excepting >=400 statusCode responses into exceptions
 *
 */
const rp = opts => {
  let url = opts.url
  if (opts.qs) {
    url += '?' + Object.keys(opts.qs)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(opts.qs[key])}`)
      .join('&')
  }
  // it appears that certain call paths from our code do not set the
  // opts.json field to true; rp is apparently more resilient to
  // this situation than needle
  opts.json = true

  return needle(opts.method.toLowerCase(), // needle takes e.g. 'put' not 'PUT'
    url,
    opts.body || opts.params,
    opts)
    .then(resp => {
      if (resp.statusCode >= 400) {
        // we turn >=400 statusCode responses into exceptions
        const error = new Error(resp.body.error || resp.statusMessage)
        error.statusCode = resp.statusCode // the http status code
        error.options = opts // the code below requires access to the input opts
        error.error = resp.body // the error body
        throw error
      } else {
        // otherwise, the response body is the expected return value
        return resp.body
      }
    })
    .catch(err => {
      // map any network/nodejs internal exception to the error structure expected by handleErrors()
      err.error = err.error || {
        error: err.message
      }
      err.options = err.options || opts
      throw err
    })
}

const rpWithRetry = opts => {
  return retry(bail => {
    // will retry on exception
    return rp(opts)
  }, opts.retry)
}

class Client {
  /**
   * @constructor
   * @param {Object} options - options of the Client
   * @param {string} [options.api]
   * @param {string} [options.api_key]
   * @param {string} [options.apihost]
   * @param {string} [options.apiversion]
   * @param {string} [options.namespace]
   * @param {boolean} [options.ignore_certs]
   * @param {string} [options.apigw_token]
   * @param {string} [options.apigw_space_guid]
   * @param {Function} [options.auth_handler]
   * @param {boolean} [options.noUserAgent]
   * @param {string} [options.cert]
   * @param {string} [options.key]
   * @param {object} [options.retry]
   * @param {number} [options.retry.retries] Number of retries on top of the initial request, default is 2.
   * @param {number} [options.retry.factor] Exponential factor, default is 2.
   * @param {number} [options.retry.minTimeout] Milliseconds before the first retry, default is 100.
   * @param {number} [options.retry.maxTimeout] Max milliseconds in between two retries, default is infinity.
   * @param {boolean} [options.retry.randomize] Randomizes the timeouts by multiplying with a factor between 1 to 2. Default is true.
   * @param {Function} [options.retry.onRetry] An optional function that is invoked after a new retry is performed. It's passed the Error that triggered it as a parameter.
   */
  constructor (options) {
    this.options = this.parseOptions(options || {})
  }

  parseOptions (options) {
    const apiKey = options.api_key || process.env['__OW_API_KEY']
    const ignoreCerts = options.ignore_certs ||
      (process.env['__OW_IGNORE_CERTS']
        ? process.env['__OW_IGNORE_CERTS'].toLowerCase() === 'true'
        : false)

    // gather proxy settings if behind a firewall
    const proxy = options.proxy || process.env.PROXY || process.env.proxy ||
      process.env.HTTP_PROXY || process.env.http_proxy ||
      process.env.HTTPS_PROXY || process.env.https_proxy

    // custom HTTP agent
    const agent = options.agent

    // if apiversion is available, use it
    const apiversion = options.apiversion || 'v1'

    // if apihost is available, parse this into full API url
    const api = options.api ||
      this.urlFromApihost(options.apihost || process.env['__OW_API_HOST'], apiversion)

    // optional tokens for API GW service
    const apigwToken = options.apigw_token || process.env['__OW_APIGW_TOKEN']
    let apigwSpaceGuid = options.apigw_space_guid || process.env['__OW_APIGW_SPACE_GUID']

    // unless space is explicitly passed, default to using auth uuid.
    if (apigwToken && !apigwSpaceGuid) {
      apigwSpaceGuid = apiKey.split(':')[0]
    }

    if (!apiKey && !options.auth_handler) {
      throw new Error(`${messages.INVALID_OPTIONS_ERROR} Missing api_key parameter or token plugin.`)
    } else if (!api) {
      throw new Error(`${messages.INVALID_OPTIONS_ERROR} Missing either api or apihost parameters.`)
    }

    // gather retry options
    const retry = options.retry
    if (retry && typeof options.retry !== 'object') {
      throw new Error(`${messages.INVALID_OPTIONS_ERROR} 'retry' option must be an object, e.g. '{ retries: 2 }'.`)
    }
    if (retry) {
      // overwrite async-retry defaults, see https://github.com/vercel/async-retry#api for more details
      retry.retries = retry.retries || 2
      retry.factor = retry.factor || 2
      retry.minTimeout = retry.minTimeout || 100
      retry.maxTimeout = retry.maxTimeout || Infinity
      retry.randomize = retry.randomize || true
    }

    return { apiKey: apiKey, api, apiVersion: apiversion, ignoreCerts: ignoreCerts, namespace: options.namespace, apigwToken: apigwToken, apigwSpaceGuid: apigwSpaceGuid, authHandler: options.auth_handler, noUserAgent: options.noUserAgent, cert: options.cert, key: options.key, proxy, agent, retry }
  }

  urlFromApihost (apihost, apiversion = 'v1') {
    if (!apihost) return apihost
    let url = `${apihost}/api/${apiversion}/`

    // if apihost does not the protocol, assume HTTPS
    if (!url.match(/http(s)?:\/\//)) {
      url = `https://${url}`
    }

    return url
  }

  request (method, path, options) {
    const params = this.params(method, path, options)
    return params.then(req => {
      if (req.retry) {
        return rpWithRetry(req)
      }
      return rp(req)
    }).catch(err => this.handleErrors(err))
  }

  params (method, path, options) {
    return this.authHeader().then(header => {
      const parms = Object.assign({
        json: true,
        method: method,
        url: this.pathUrl(path),
        rejectUnauthorized: !this.options.ignoreCerts
      }, options)

      parms.headers = Object.assign({
        'User-Agent': (options && options['User-Agent']) || process.env['__OW_USER_AGENT'] || 'openwhisk-client-js',
        Authorization: header
      }, parms.headers)

      if (this.options.cert && this.options.key) {
        parms.cert = this.options.cert
        parms.key = this.options.key
      }

      if (this.options.noUserAgent || parms.noUserAgent) {
        // caller asked for no user agent?
        parms.headers['User-Agent'] = undefined
      }
      if (typeof this.options.namespace === 'string') {
        // identify namespace targeting a public/shared entity
        parms.headers['x-namespace-id'] = this.options.namespace
      }
      if (process.env['__OW_TRANSACTION_ID']) {
        parms.headers['x-request-id'] = process.env['__OW_TRANSACTION_ID']
      }

      if (this.options.proxy) {
        parms.proxy = this.options.proxy
      }

      if (this.options.agent) {
        parms.agent = this.options.agent
      }

      if (this.options.retry) {
        parms.retry = this.options.retry
      }

      return parms
    })
  }

  pathUrl (urlPath) {
    const endpoint = this.apiUrl()
    endpoint.pathname = url.resolve(endpoint.pathname, urlPath)
    return url.format(endpoint)
  }

  apiUrl () {
    return url.parse(
      this.options.api.endsWith('/') ? this.options.api : this.options.api + '/'
    )
  }

  authHeader () {
    if (this.options.authHandler) {
      return this.options.authHandler.getAuthHeader()
    } else {
      const apiKeyBase64 = Buffer.from(this.options.apiKey).toString('base64')
      return Promise.resolve(`Basic ${apiKeyBase64}`)
    }
  }
  handleErrors (reason) {
    let message = `Unknown Error From API: ${reason.message}`
    if (reason.hasOwnProperty('statusCode')) {
      const responseError = this.errMessage(reason.error)
      message = `${reason.options.method} ${reason.options.url} Returned HTTP ${reason.statusCode} (${http.STATUS_CODES[reason.statusCode]}) --> "${responseError}"`
    }

    throw new OpenWhiskError(message, reason.error, reason.statusCode)
  }

  // Error messages might be returned from platform or using custom
  // invocation result response from action.
  errMessage (error) {
    if (!error) return 'Response Missing Error Message.'

    if (typeof error.error === 'string') {
      return error.error
    } else if (error.response && error.response.result) {
      const result = error.response.result
      if (result.error) {
        if (typeof result.error === 'string') {
          return result.error
        } else if (typeof result.error.error === 'string') {
          return result.error.error
        } else if (result.error.statusCode) {
          return `application error, status code: ${result.error.statusCode}`
        }
      }
    }

    return 'Response Missing Error Message.'
  }
}

module.exports = Client

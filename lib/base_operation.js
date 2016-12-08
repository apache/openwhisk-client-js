'use strict'

const messages = require('./messages')
const BaseOperationError = require('./base_operation_error')
const rp = require('request-promise')
const url = require('url')

class BaseOperation {
  constructor (options) {
    this.options = this.parse_options(options || {})
  }

  parse_options (options) {
    const api_key = options.api_key || process.env['__OW_API_KEY']
    const namespace = options.namespace || process.env['__OW_NAMESPACE']
    const ignore_certs = options.ignore_certs
    // if apihost is available, parse this into full API url
    const api = options.api ||
      this.url_from_apihost(options.apihost || process.env['__OW_API_HOST'])

    if (!api_key) {
      throw new Error(`${messages.INVALID_OPTIONS_ERROR} Missing api_key parameter.`)
    } else if (!api) {
      throw new Error(`${messages.INVALID_OPTIONS_ERROR} Missing either api or apihost parameters.`)
    }

    return {api_key, namespace, api, ignore_certs}
  }

  url_from_apihost (apihost) {
    if (!apihost) return apihost
    let url = `${apihost}/api/v1/`

    // if apihost does not the protocol, assume HTTPS
    if (!url.match(/http(s)?:\/\//)) {
      url = `https://${url}`
    }

    return url
  }

  request (options) {
    return rp(options).catch(err => this.handle_errors(err))
  }

  params (method, path) {
    return {
      json: true,
      method: method,
      url: this.path_url(path),
      rejectUnauthorized: !this.options.ignore_certs,
      headers: {
        Authorization: this.auth_header()
      }
    }
  }

  path_url (url_path) {
    const endpoint = this.api_url()
    endpoint.pathname = url.resolve(endpoint.pathname, url_path)
    return url.format(endpoint)
  }

  api_url () {
    return url.parse(
      this.options.api.endsWith('/') ? this.options.api : this.options.api + '/'
    )
  }

  namespace (options) {
    if (options && typeof options.namespace === 'string') {
      return encodeURIComponent(options.namespace)
    } else if (typeof this.options.namespace === 'string') {
      return encodeURIComponent(this.options.namespace)
    }

    throw new Error(messages.MISSING_NAMESPACE_ERROR)
  }

  qs (options, names) {
    return names.filter(name => options.hasOwnProperty(name))
      .reduce((previous, name) => {
        previous[name] = options[name]
        return previous
      }, {})
  }

  auth_header () {
    const api_key_base64 = new Buffer(this.options.api_key).toString('base64')
    return `Basic ${api_key_base64}`
  }

  err_message (error) {
    if (!error) return 'Missing error message.'

    if (typeof error.error === 'string') {
      return error.error
    } else if (error.response && error.response.result && typeof error.response.result.error === 'string') {
      return error.response.result.error
    }

    return 'Missing error message.'
  }

  handle_errors (reason) {
    if (reason.hasOwnProperty('statusCode')) {
      let error
      switch (reason.statusCode) {
        case 400:
          error = messages.BAD_REQUEST_ERROR
          break
        case 401:
        case 403:
          error = messages.INVALID_AUTH_ERROR
          break
        case 404:
          error = messages.MISSING_URL_ERROR
          break
        case 408:
          error = messages.INVOKE_TIMEOUT_ERROR
          break
        case 409:
          error = messages.CREATE_CONFLICT_ERROR
          break
        case 502:
          error = messages.ACTION_INVOCATION_ERROR
          break
        default:
          error = messages.API_SYSTEM_ERROR
      }

      throw new BaseOperationError(`${error} ${this.err_message(reason.error)}`, reason.error)
    }

    throw new Error(`Error encountered calling OpenWhisk: ${reason.message}`)
  }
}

module.exports = BaseOperation

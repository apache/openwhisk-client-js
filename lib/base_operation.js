'use strict'

const messages = require('./messages')
const BaseOperationError = require('./base_operation_error')
const rp = require('request-promise')
const url = require('url')

class BaseOperation {
  constructor (options) {
    this.validate_options(options)
    this.options = options
  }

  validate_options (options) {
    if (!options.hasOwnProperty('api_key')) {
      throw new Error(`${messages.INVALID_OPTIONS_ERROR} Missing api_key parameter.`)
    }
    if (!options.hasOwnProperty('api')) {
      if (!options.hasOwnProperty('apihost')) {
        throw new Error(`${messages.INVALID_OPTIONS_ERROR} Missing either api or apihost parameters.`)
      }

      options.api = this.url_from_apihost(options.apihost)
    }
  }

  url_from_apihost (apihost) {
    const is_http = apihost.includes(':') && !apihost.includes(':443')
    const protocol = is_http ? 'http' : 'https'
    return `${protocol}://${apihost}/api/v1/`
  }

  request (options) {
    return rp(options).catch(err => this.handle_errors(err))
  }

  params (method, path) {
    return {
      json: true,
      method: method,
      url: this.path_url(path),
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

  handle_errors (reason) {
    if (reason.hasOwnProperty('statusCode')) {
      switch (reason.statusCode) {
        case 401:
        case 403:
          throw new Error(messages.INVALID_AUTH_ERROR)
        case 404:
          throw new Error(messages.MISSING_URL_ERROR)
        case 408:
          throw new Error(messages.INVOKE_TIMEOUT_ERROR)
        case 409:
          throw new Error(messages.CREATE_CONFLICT_ERROR)
        default:
          let error = 'Missing error message.'
          if (reason.error) {
            if (reason.error.response && reason.error.response.result && reason.error.response.result.error) {
              error = reason.error.response.result.error
            }
            throw new BaseOperationError(`${messages.API_SYSTEM_ERROR} ${error}`, reason.error)
          } else {
            throw new Error(`${messages.API_SYSTEM_ERROR} ${error}`)
          }
      }
    }

    throw new Error(`Error encountered calling OpenWhisk: ${reason.message}`)
  }
}

module.exports = BaseOperation

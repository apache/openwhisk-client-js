'use strict'

const messages = require('./messages')
const rp = require('request-promise')
const url = require('url')
const path = require('path')

class BaseOperation {
  constructor (options) {
    this.options = options
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
    const endpoint = url.parse(this.options.api)
    endpoint.pathname = path.resolve(endpoint.pathname, url_path)
    return url.format(endpoint)
  }

  namespace (options) {
    if (options && options.hasOwnProperty('namespace')) {
      return options.namespace
    } else if (this.options.hasOwnProperty('namespace')) {
      return this.options.namespace
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
          if (reason.error && reason.error.response && reason.error.response.result && reason.error.response.result.error) {
            error = reason.error.response.result.error
          }
          throw new Error(`${messages.API_SYSTEM_ERROR} ${error}`)
      }
    }

    throw new Error(`Error encountered calling OpenWhisk: ${reason.message}`)
  }
}

module.exports = BaseOperation

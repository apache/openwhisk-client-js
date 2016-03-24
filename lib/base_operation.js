'use strict'

const messages = require('./messages')
const rp = require('request-promise')

class BaseOperation {
  constructor (options) {
    this.options = options
  }

  request (options) {
    return rp.get(options).catch(err => this.handle_errors(err))
  }

  params (path) {
    return {
      url: `${this.options.api}${path}`,
      headers: {
        Authorization: this.auth_header()
      }
    }
  }

  namespace (options) {
    if (options && options.hasOwnProperty('namespace')) {
      return options.namespace
    } else if (this.options.hasOwnProperty('namespace')) {
      return this.options.namespace
    }
  }

  qs (options, names) {
    const qs = {}
    names.filter(name => options.hasOwnProperty(name))
      .forEach(name => qs[name] = options[name])
    return qs
  }

  auth_header () {
    const api_key_base64 = new Buffer(this.options.api_key).toString('base64')
    return `Basic ${api_key_base64}`
  }

  handle_errors (reason) {
    if (reason.hasOwnProperty('statusCode')) {
      switch (reason.statusCode) {
        case 401:
          throw new Error(messages.INVALID_AUTH_ERROR)
        case 404:
          throw new Error(messages.MISSING_URL_ERROR)
        default:
          throw new Error(messages.API_SYSTEM_ERROR)
      }
    }

    throw new Error(`Error encountered calling OpenWhisk: ${reason.message}`)
  }
}

module.exports = BaseOperation

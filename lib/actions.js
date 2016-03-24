'use strict'

const rp = require('request-promise')
const messages = require('./messages')

class Actions {
  constructor (options) {
    this.options = options
  }

  list (options) {
    const namespace = this.namespace(options)
    const qs = this.qs(options || {}, ['skip', 'limit'])
    const headers = { Authorization: this.auth_header() }

    if (!namespace) {
      return Promise.reject(messages.MISSING_NAMESPACE_ERROR)
    }

    return rp.get({
      url: `${this.options.api}namespaces/${namespace}/actions`,
      headers: headers,
      qs: qs
    }).catch(err => this.handle_errors(err))
  }

  qs (options, names) {
    const qs = {}
    names.filter(name => options.hasOwnProperty(name))
      .forEach(name => qs[name] = options[name])
    return qs
  }

  namespace (options) {
    if (options && options.hasOwnProperty('namespace')) {
      return options.namespace
    } else if (this.options.hasOwnProperty('namespace')) {
      return this.options.namespace
    }
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

module.exports = Actions

'use strict'

const messages = require('./messages')
const BaseOperation = require('./base_operation')

class Actions extends BaseOperation {

  list (options) {
    options = options || {}
    const namespace = this.namespace(options)
    const params = this.params('GET', `namespaces/${namespace}/actions`)
    params.qs = this.qs(options || {}, ['skip', 'limit'])

    return this.request(params)
  }

  get (options) {
    return this.request(this.action('GET', options))
  }

  delete (options) {
    return this.request(this.action('DELETE', options))
  }

  create (options) {
    if (!options.hasOwnProperty('action')) {
      throw new Error(messages.MISSING_ACTION_BODY_ERROR)
    }

    const params = this.action('PUT', options)
    params.body = options.action

    if (options.hasOwnProperty('overwrite')) {
      params.overwrite = options.overwrite
    }

    return this.request(params)
  }

  update (options) {
    options.overwrite = true
    return this.create(options)
  }

  invoke (options) {
    const params = this.action('POST', options)
    params.body = this.payload(options)
    params.qs = this.qs(options || {}, ['blocking'])

    return this.request(params)
  }

  payload (options) {
    if (!options.hasOwnProperty('payload')) {
      return ''
    }

    if (typeof options.payload === 'object') {
      return JSON.stringify(options.payload)
    }

    return options.payload
  }

  action (method, options) {
    const action = options.actionName
    const namespace = this.namespace(options)
    const params = this.params(method, `namespaces/${namespace}/actions/${action}`)

    if (!action) {
      throw new Error(messages.MISSING_ACTION_ERROR)
    }

    return params
  }
}

module.exports = Actions

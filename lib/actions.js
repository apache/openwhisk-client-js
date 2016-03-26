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
    return this.action('GET', options)
  }

  delete (options) {
    return this.action('DELETE', options)
  }

  create (options) {
    const action = options.actionName
    const namespace = this.namespace(options)
    const params = this.params('PUT', `namespaces/${namespace}/actions/${action}`)
    params.body = options.action

    if (!action) {
      throw new Error(messages.MISSING_ACTION_ERROR)
    }

    if (!params.body) {
      throw new Error(messages.MISSING_ACTION_BODY_ERROR)
    }

    return this.request(params)
  }

  action (method, options) {
    const action = options.actionName
    const namespace = this.namespace(options)
    const params = this.params(method, `namespaces/${namespace}/actions/${action}`)

    if (!action) {
      throw new Error(messages.MISSING_ACTION_ERROR)
    }

    return this.request(params)
  }
}

module.exports = Actions

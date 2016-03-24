'use strict'

const messages = require('./messages')
const BaseOperation = require('./base_operation')

class Actions extends BaseOperation {

  list (options) {
    const namespace = this.namespace(options)
    const params = this.params(`namespaces/${namespace}/actions`)
    params.qs = this.qs(options || {}, ['skip', 'limit'])

    if (!namespace) {
      return Promise.reject(messages.MISSING_NAMESPACE_ERROR)
    }

    return this.request(params)
  }

  get (options) {
    const action = options.actionName
    const namespace = this.namespace(options)
    const params = this.params(`namespaces/${namespace}/actions/${action}`)

    if (!namespace) {
      return Promise.reject(messages.MISSING_NAMESPACE_ERROR)
    }

    if (!action) {
      return Promise.reject(messages.MISSING_ACTION_ERROR)
    }

    return this.request(params)
  }
}

module.exports = Actions

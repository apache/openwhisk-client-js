'use strict'

const BaseOperation = require('./base_operation')
const messages = require('./messages')

class Activations extends BaseOperation {
  list (options) {
    options = options || {}
    const namespace = this.namespace(options)
    options.qs = this.qs(options || {}, ['name', 'skip', 'limit', 'upto', 'docs', 'since'])
    return this.client.request('GET', `namespaces/${namespace}/activations`, options)
  }

  get (options) {
    return this.activation(options)
  }

  logs (options) {
    return this.activation(options, 'logs')
  }

  result (options) {
    return this.activation(options, 'result')
  }

  activation (options, path) {
    const id = this.get_activation(options)
    const namespace = this.namespace(options)
    const url_path = `namespaces/${namespace}/activations/${id}` + (path ? `/${path}` : '')
    return this.client.request('GET', url_path)
  }

  get_activation (options) {
    options = options || {}

    const id = options.id || options.activation

    if (!id) {
      throw new Error(messages.MISSING_ACTIVATION_ID_ERROR)
    }

    return id
  }
}

module.exports = Activations

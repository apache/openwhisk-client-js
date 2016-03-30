'use strict'

const BaseOperation = require('./base_operation')
const messages = require('./messages')

class Activations extends BaseOperation {
  list (options) {
    const namespace = this.namespace(options)
    const params = this.params('GET', `namespaces/${namespace}/activations`)
    params.qs = this.qs(options || {}, ['name', 'skip', 'limit', 'upto', 'docs'])
    return this.request(params)
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
    if (!options || !options.hasOwnProperty('activation')) {
      throw new Error(messages.MISSING_ACTIVATION_ID_ERROR)
    }

    const namespace = this.namespace(options)
    const params = this.params('GET', `namespaces/${namespace}/activations/${options.activation}/${path || ''}`)
    return this.request(params)
  }
}

module.exports = Activations

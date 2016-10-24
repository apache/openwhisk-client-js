'use strict'

const BaseOperation = require('./base_operation')
const messages = require('./messages')

class Activations extends BaseOperation {
  list (options) {
    const namespace = this.namespace(options)
    const params = this.params('GET', `namespaces/${namespace}/activations`)
    params.qs = this.qs(options || {}, ['name', 'skip', 'limit', 'upto', 'docs', 'since'])
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
    const url_path = `namespaces/${namespace}/activations/${options.activation}` + (path ? `/${path}` : '')
    const params = this.params('GET', url_path)
    return this.request(params)
  }
}

module.exports = Activations

'use strict'

const BaseOperation = require('./base_operation')

class Namespaces extends BaseOperation {
  list () {
    const params = this.params('GET', `namespaces`)
    return this.request(params)
  }

  get (options) {
    const namespace = this.namespace(options)
    const params = this.params('GET', `namespaces/${namespace}`)
    return this.request(params)
  }
}

module.exports = Namespaces

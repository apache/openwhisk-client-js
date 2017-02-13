'use strict'

const messages = require('./messages')
const BaseOperationError = require('./base_operation_error')
const rp = require('request-promise')
const url = require('url')

class BaseOperation {
  constructor (namespace, client) {
    this.global_ns = namespace
    this.client = client
  }

  list (options) {
    options = options || {}
    return this.request({method: 'GET', options})
  }

  request (params) {
    const namespace = this.namespace(params.options)
    const path = this.resource_path(namespace, params.id)
    this.client.request(params.method, path)
  }

  resource_path (namespace, id) {
    let path = `namespace/${namespace}/${this.resource}`

    if (id) {
      path = `${path}/${id}`
    }

    return path
  }

  namespace (options) {
    if (options && typeof options.namespace === 'string') {
      return encodeURIComponent(options.namespace)
    } else if (typeof this.global_ns === 'string') {
      return encodeURIComponent(this.global_ns)
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
}

module.exports = BaseOperation

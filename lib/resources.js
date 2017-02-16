'use strict'

const BaseOperation = require('./base_operation')
const names = require('./names')

class Resources extends BaseOperation {
  constructor (client) {
    super(client)
    this.identifiers = ['id']
  }

  list (options) {
    return this.operation('GET', options)
  }

  get (options) {
    return this.operation_with_id('GET', options)
  }

  invoke (options) {
    return this.operation_with_id('POST', options)
  }

  create (options) {
    return this.operation_with_id('PUT', options)
  }

  delete (options) {
    return this.operation_with_id('DELETE', options)
  }

  update (options) {
    options.overwrite = true
    return this.create(options)
  }

  operation (method, options) {
    options = options || {}
    const id = options.id
    return this.request({ method, id, options })
  }

  operation_with_id (method, options) {
    const id = this.parse_id(options)
    const ns = this.parse_namespace(options)
    options.namespace = ns
    options.id = id
    return this.operation(method, options)
  }

  parse_id (options) {
    const id = this.retrieve_id(options)
    return names.parse_id(id)
  }

  parse_namespace (options) {
    if (options.hasOwnProperty('namespace')) {
      return options.namespace
    }

    const id = this.retrieve_id(options)
    return names.parse_namespace(id)
  }

  retrieve_id (options) {
    options = options || {}
    const id = this.identifiers.find(name => options.hasOwnProperty(name))

    if (!id) throw new Error(`Missing resource identifier from parameters, supported parameter names: ${this.identifiers.join(', ')}`)

    return options[id]
  }

  payload (options) {
    if (!options.hasOwnProperty('params')) {
      return {}
    }

    if (typeof options.params === 'object') {
      return options.params
    }

    throw new Error('Invalid payload type, must be an object.')
  }
}

module.exports = Resources

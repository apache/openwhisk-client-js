'use strict'

const BaseOperation = require('./base_operation')
const messages = require('./messages')

class Resources extends BaseOperation {
  constructor (namespace, client) {
    super(namespace, client)
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

    if (!id.startsWith('/')) {
      return id
    }

    return this.parse_id_and_ns(id).id
  }

  parse_namespace (options) {
    const id = this.retrieve_id(options)

    if (!id.startsWith('/')) {
      return options.namespace
    }

    return this.parse_id_and_ns(id).namespace
  }

  parse_id_and_ns (id_and_ns) {
    const paths = id_and_ns.split('/')

    if (paths.length !== 3 && paths.length !== 4) {
      throw new Error(messages.INVALID_RESOURCE_ERROR)
    }

    const namespace = paths[1]
    const id = paths.slice(2).join('/')

    return { id, namespace }
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

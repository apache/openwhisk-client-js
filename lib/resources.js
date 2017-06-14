// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

'use strict'

const BaseOperation = require('./base_operation')
const names = require('./names')

class Resources extends BaseOperation {
  constructor (client) {
    super(client)
    this.identifiers = ['name']
    this.qs_options = {}
  }

  list (options) {
    return this.operation('GET', options)
  }

  get (options) {
    return this.operation_with_id('GET', options)
  }

  invoke (options) {
    options = options || {}
    if (typeof options === 'object' && !Array.isArray(options)) {
      options.qs = this.qs(options, this.qs_options.invoke || [])
      options.body = this.payload(options)
    }
    return this.operation_with_id('POST', options)
  }

  create (options) {
    return this.operation_with_id('PUT', options)
  }

  delete (options) {
    return this.operation_with_id('DELETE', options)
  }

  update (options) {
    options = this.parse_options(options)
    options.overwrite = true
    return this.create(options)
  }

  operation (method, options) {
    options = this.parse_options(options)
    const id = options.id
    return this.request({ method, id, options })
  }

  operation_with_id (method, options) {
    if (Array.isArray(options)) {
      return Promise.all(options.map(i => this.operation_with_id(method, i)))
    }

    options = this.parse_options(options)
    options.namespace = this.parse_namespace(options)
    options.id = this.parse_id(options)
    return this.operation(method, options)
  }

  parse_options (options) {
    if (typeof options === 'string') {
      options = { name: options }
    }

    return options || {}
  }

  parse_id (options) {
    const id = this.retrieve_id(options)
    return names.parse_id(id)
  }

  parse_namespace (options) {
    const id = this.retrieve_id(options)

    if (id.startsWith('/')) {
      return names.parse_namespace(id)
    }

    return options.namespace
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

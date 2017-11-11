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
    return this.operationWithId('GET', options)
  }

  invoke (options) {
    options = options || {}
    if (typeof options === 'object' && !Array.isArray(options)) {
      options.qs = this.qs(options, this.qs_options.invoke || [])
      options.body = this.payload(options)
    }
    return this.operationWithId('POST', options)
  }

  create (options) {
    return this.operationWithId('PUT', options)
  }

  delete (options) {
    return this.operationWithId('DELETE', options)
  }

  update (options) {
    options = this.parseOptions(options)
    options.overwrite = true
    return this.create(options)
  }

  operation (method, options) {
    options = this.parseOptions(options)
    const id = options.id
    return this.request({method, id, options})
  }

  operationWithId (method, options) {
    if (Array.isArray(options)) {
      return Promise.all(options.map(i => this.operationWithId(method, i)))
    }

    options = this.parseOptions(options)
    options.namespace = this.parseNamespace(options)
    options.id = this.parseId(options)
    return this.operation(method, options)
  }

  parseOptions (options) {
    if (typeof options === 'string') {
      options = {name: options}
    }

    return options || {}
  }

  parseId (options) {
    const id = this.retrieveId(options)
    return names.parseId(id)
  }

  parseNamespace (options) {
    const id = this.retrieveId(options)

    if (id.startsWith('/')) {
      return names.parseNamespace(id)
    }

    return options.namespace
  }

  retrieveId (options) {
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

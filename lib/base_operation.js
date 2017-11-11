// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

'use strict'

const names = require('./names')

class BaseOperation {
  constructor (client) {
    this.client = client
  }

  request (params) {
    const namespace = this.namespace(params.options)
    const path = this.resourcePath(namespace, params.id)
    return this.client.request(params.method, path, params.options)
  }

  resourcePath (namespace, id) {
    let path = `namespaces/${namespace}/${this.resource}`

    if (id) {
      path = `${path}/${id}`
    }

    return path
  }

  namespace (options) {
    if (options && typeof options.namespace === 'string') {
      return encodeURIComponent(options.namespace)
    }

    if (this.client.options && typeof this.client.options.namespace === 'string') {
      return encodeURIComponent(this.client.options.namespace)
    }

    return encodeURIComponent(names.defaultNamespace())
  }

  qs (options, names) {
    options = options || {}
    return names.filter(name => options.hasOwnProperty(name))
      .reduce((previous, name) => {
        previous[name] = options[name]
        return previous
      }, {})
  }
}

module.exports = BaseOperation

// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

'use strict'

const BaseOperation = require('./base_operation')

class Namespaces extends BaseOperation {
  list () {
    return this.client.request('GET', 'namespaces')
  }

  get () {
    let actions = this.client.request('GET', 'namespaces/_/actions')
    let packages = this.client.request('GET', 'namespaces/_/packages')
    let triggers = this.client.request('GET', 'namespaces/_/triggers')
    let rules = this.client.request('GET', 'namespaces/_/rules')
    return Promise
      .all([actions, packages, triggers, rules])
      .then(([actions, packages, triggers, rules]) => ({actions, packages, triggers, rules}))
  }
}

module.exports = Namespaces

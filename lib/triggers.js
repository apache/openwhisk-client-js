// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

'use strict'

const Resources = require('./resources')

class Triggers extends Resources {
  constructor (client) {
    super(client)
    this.resource = 'triggers'
    this.identifiers.push('triggerName')
  }

  list (options) {
    options = options || {}
    options.qs = this.qs(options, ['skip', 'limit', 'count'])

    return super.list(options)
  }

  create (options) {
    options.qs = this.qs(options, ['overwrite'])
    options.body = options.trigger || {}

    return super.create(options)
  }
}

module.exports = Triggers

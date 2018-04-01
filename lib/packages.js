// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

'use strict'

const Resources = require('./resources')

class Packages extends Resources {
  constructor (client) {
    super(client)
    this.resource = 'packages'
    this.identifiers.push('packageName')
  }

  list (options) {
    options = options || {}
    options.qs = this.qs(options, ['skip', 'limit', 'public', 'count'])

    return super.list(options)
  }

  invoke () {
    throw new Error(`Operation (invoke) not supported for rule resource.`)
  }

  create (options) {
    options = this.parseOptions(options)
    options.qs = this.qs(options, ['overwrite'])
    options.body = options.package || {}

    return super.create(options)
  }
}

module.exports = Packages

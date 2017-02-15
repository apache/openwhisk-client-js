'use strict'

const Resources = require('./resources')

class Triggers extends Resources {
  constructor (namespace, client) {
    super(namespace, client)
    this.resource = 'triggers'
    this.identifiers.push('triggerName')
  }

  list (options) {
    options = options || {}
    options.qs = this.qs(options, ['skip', 'limit'])

    return super.list(options)
  }

  invoke (options) {
    options = options || {}
    options.body = this.payload(options)

    return super.invoke(options)
  }

  create (options) {
    options.qs = this.qs(options, ['overwrite'])
    options.body = options.trigger || {}

    return super.create(options)
  }
}

module.exports = Triggers

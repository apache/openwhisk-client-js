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
    options.qs = this.qs(options, ['skip', 'limit', 'public'])

    return super.list(options)
  }

  invoke () {
    throw new Error(`Operation (invoke) not supported for rule resource.`)
  }

  create (options) {
    options = this.parse_options(options)
    options.qs = this.qs(options, ['overwrite'])
    options.body = options.package || {}

    return super.create(options)
  }
}

module.exports = Packages

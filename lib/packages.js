'use strict'

const messages = require('./messages')
const BaseOperation = require('./base_operation')

class Packages extends BaseOperation {

  list (options) {
    options = options || {}
    const namespace = this.namespace(options)
    const params = this.params('GET', `namespaces/${namespace}/packages`)
    params.qs = this.qs(options || {}, ['skip', 'limit', 'public'])

    return this.request(params)
  }

  get (options) {
    return this.request(this.packageName('GET', options))
  }

  delete (options) {
    return this.request(this.packageName('DELETE', options))
  }

  create (options) {
    const params = this.packageName('PUT', options)
    params.body = options.package || {}
    params.qs = this.qs(options, ['overwrite'])

    return this.request(params)
  }

  update (options) {
    options.overwrite = true
    return this.create(options)
  }

  packageName (method, options) {
    if (!options.hasOwnProperty('packageName')) {
      throw new Error(messages.MISSING_PACKAGE_ERROR)
    }

    const packageName = options.packageName
    const namespace = this.namespace(options)
    const params = this.params(method, `namespaces/${namespace}/packages/${packageName}`)

    return params
  }
}

module.exports = Packages

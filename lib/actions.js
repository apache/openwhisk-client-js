'use strict'

const rp = require('request-promise')

const MISSING_NAMESPACE_ERROR = 'Missing namespace from options, ' +
 'please set a default namespace or pass one in the options.'

class Actions {
  constructor (options) {
    this.options = options
  }

  list (options) {
    const namespace = this.namespace(options)
    const qs = this.qs(options || {}, ['skip', 'limit'])

    if (!namespace) {
      return Promise.reject(MISSING_NAMESPACE_ERROR)
    }

    return rp.get({
      url: `${this.options.api}namespaces/${namespace}/actions`,
      qs: qs
    })
  }

  qs (options, names) {
    const qs = {}
    names.filter(name => options.hasOwnProperty(name))
      .forEach(name => qs[name] = options[name])
    return qs
  }

  namespace (options) {
    if (options && options.hasOwnProperty('namespace')) {
      return options.namespace
    } else if (this.options.hasOwnProperty('namespace')) {
      return this.options.namespace
    }
  }
}

module.exports = Actions

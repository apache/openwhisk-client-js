'use strict'

const messages = require('./messages')
const BaseOperation = require('./base_operation')

class Rules extends BaseOperation {

  list (options) {
    options = options || {}
    const namespace = this.namespace(options)
    const params = this.params('GET', `namespaces/${namespace}/rules`)
    params.qs = this.qs(options || {}, ['skip', 'limit'])

    return this.request(params)
  }

  get (options) {
    return this.request(this.rule('GET', options))
  }

  delete (options) {
    return this.request(this.rule('DELETE', options))
  }

  create (options) {
    if (!options.hasOwnProperty('rule')) {
      throw new Error(messages.MISSING_RULE_BODY_ERROR)
    }

    const params = this.rule('PUT', options)
    params.body = options.rule
    params.qs = this.qs(options, ['overwrite'])

    return this.request(params)
  }

  update (options) {
    options.overwrite = true
    return this.create(options)
  }

  enable (options) {
    options.state = 'enabled'
    return this.state(options)
  }

  disable (options) {
    options.state = 'disabled'
    return this.state(options)
  }

  state (options) {
    const params = this.rule('POST', options)
    params.qs = this.qs(options, ['state'])

    return this.request(params)
  }

  rule (method, options) {
    const rule = options.ruleName
    const namespace = this.namespace(options)
    const params = this.params(method, `namespaces/${namespace}/rules/${rule}`)

    if (!rule) {
      throw new Error(messages.MISSING_RULE_ERROR)
    }

    return params
  }
}

module.exports = Rules

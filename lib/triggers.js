'use strict'

const messages = require('./messages')
const BaseOperation = require('./base_operation')

class Triggers extends BaseOperation {

  list (options) {
    options = options || {}
    const namespace = this.namespace(options)
    const params = this.params('GET', `namespaces/${namespace}/triggers`)
    params.qs = this.qs(options || {}, ['skip', 'limit'])

    return this.request(params)
  }

  get (options) {
    return this.request(this.trigger('GET', options))
  }

  delete (options) {
    return this.request(this.trigger('DELETE', options))
  }

  create (options) {
    const params = this.trigger('PUT', options)
    params.body = options.trigger || {}
    params.qs = this.qs(options, ['overwrite'])

    return this.request(params)
  }

  update (options) {
    options.overwrite = true
    return this.create(options)
  }

  invoke (options) {
    const params = this.trigger('POST', options)
    params.body = this.payload(options)

    return this.request(params)
  }

  trigger (method, options) {
    if (!options.hasOwnProperty('triggerName')) {
      throw new Error(messages.MISSING_TRIGGER_ERROR)
    }

    const trigger = options.triggerName
    const namespace = this.namespace(options)
    const params = this.params(method, `namespaces/${namespace}/triggers/${trigger}`)

    return params
  }

  payload (options) {
    if (!options.hasOwnProperty('params')) {
      return {}
    }

    if (typeof options.params === 'object') {
      return options.params
    }

    throw new Error('Trigger invocation params type invalid, must be an object.')
  }
}

module.exports = Triggers

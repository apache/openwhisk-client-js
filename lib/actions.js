'use strict'

const messages = require('./messages')
const BaseOperation = require('./base_operation')

class Actions extends BaseOperation {

  list (options) {
    options = options || {}
    const namespace = this.namespace(options)
    const params = this.params('GET', `namespaces/${namespace}/actions`)
    params.qs = this.qs(options || {}, ['skip', 'limit'])

    return this.request(params)
  }

  get (options) {
    return this.request(this.action('GET', options))
  }

  delete (options) {
    return this.request(this.action('DELETE', options))
  }

  create (options) {
    if (!options.hasOwnProperty('action')) {
      throw new Error(messages.MISSING_ACTION_BODY_ERROR)
    }

    const params = this.action('PUT', options)
    params.body = this.action_body(options)
    params.qs = this.qs(options, ['overwrite'])

    return this.request(params)
  }

  update (options) {
    options.overwrite = true
    return this.create(options)
  }

  invoke (options) {
    const params = this.action('POST', options)
    params.body = this.payload(options)
    params.qs = this.qs(options || {}, ['blocking'])

    return this.request(params)
  }

  payload (options) {
    if (!options.hasOwnProperty('params')) {
      return {}
    }

    if (typeof options.params === 'object') {
      return options.params
    }

    throw new Error('Action invocation params type invalid, must be an object.')
  }

  action (method, options) {
    if (!options.actionName) {
      throw new Error(messages.MISSING_ACTION_ERROR)
    }

    const name_and_ns = this.parse_name_and_ns(options)
    const params = this.params(method, `namespaces/${name_and_ns.namespace}/actions/${name_and_ns.action}`)

    return params
  }

  parse_name_and_ns (options) {
    if (!options.actionName.startsWith('/')) {
      return { action: options.actionName, namespace: this.namespace(options) }
    }

    // fully-qualified action name...
    // /namespace/action_name
    // or
    // /namespace/package/action_name
    return this.parse_qualified_action_name(options.actionName)
  }

  parse_qualified_action_name (actionName) {
    const paths = actionName.split('/')

    if (paths.length !== 3 && paths.length !== 4) {
      throw new Error(messages.INVALID_ACTION_ERROR)
    }

    const namespace = paths[1]
    const action = paths.slice(2).join('/')

    return { namespace, action }
  }

  action_body (options) {
    if (options.action instanceof Buffer) {
      options.action = options.action.toString('base64')
    } else if (typeof options.action === 'object') {
      return options.action
    }

    var returned_opts = { exec: { kind: 'nodejs:default', code: options.action } };
    if ( options.parameters !== null && typeof(options.parameters) !== "undefined") {
      returned_opts.parameters = options.parameters;
    }

    return returned_opts
  }
}

module.exports = Actions

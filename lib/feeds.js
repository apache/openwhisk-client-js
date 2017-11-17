// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

'use strict'

const messages = require('./messages')
const names = require('./names')
const Actions = require('./actions')

class Feeds {
  constructor (client) {
    this.actions = new Actions(client)
    this.client = client
  }

  delete (options) {
    return this.feed('DELETE', options)
  }

  create (options) {
    return this.feed('CREATE', options)
  }

  get (options) {
    return this.feed('READ', options)
  }

  update (options) {
    return this.feed('UPDATE', options)
  }

  feed (event, options) {
    if (!this.feed_name(options)) {
      throw new Error(messages.MISSING_FEED_NAME_ERROR)
    }

    if (!this.trigger_name(options)) {
      throw new Error(messages.MISSING_FEED_TRIGGER_ERROR)
    }

    const invoke_options = this.invoke_options(event, options)
    return this.actions.invoke(invoke_options)
  }

  feed_name (options) {
    return options.feedName || options.name
  }

  trigger_name (options) {
    if (!options.trigger) return
    if (options.trigger.startsWith('/')) return options.trigger

    const ns = this.client.options.namespace || names.default_namespace()

    return `/${ns}/${options.trigger}`
  }

  invoke_options (event, options) {
    const params = this.invoke_params(event, options)

    const invoke_options = {
      name: this.feed_name(options),
      namespace: options.namespace,
      blocking: true,
      params
    }

    return invoke_options
  }

  invoke_params (event, options) {
    const params = {
      lifecycleEvent: event,
      authKey: this.client.options.api_key,
      triggerName: this.trigger_name(options)
    }

    // Add user-provided invocation parameters
    Object.assign(params, options.params || {})

    return params
  }
}

module.exports = Feeds

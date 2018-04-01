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
    if (!this.feedName(options)) {
      throw new Error(messages.MISSING_FEED_NAME_ERROR)
    }

    if (!this.triggerName(options)) {
      throw new Error(messages.MISSING_FEED_TRIGGER_ERROR)
    }

    const invokeOptions = this.invokeOptions(event, options)
    return this.actions.invoke(invokeOptions)
  }

  feedName (options) {
    return options.feedName || options.name
  }

  triggerName (options) {
    if (!options.trigger) return
    if (options.trigger.startsWith('/')) return options.trigger

    const ns = this.client.options.namespace || names.defaultNamespace()

    return `/${ns}/${options.trigger}`
  }

  invokeOptions (event, options) {
    const params = this.invokeParams(event, options)

    const invokeOptions = {
      name: this.feedName(options),
      namespace: options.namespace,
      blocking: true,
      params
    }

    return invokeOptions
  }

  invokeParams (event, options) {
    const params = {
      lifecycleEvent: event,
      authKey: this.client.options.apiKey,
      triggerName: this.triggerName(options)
    }

    // Add user-provided invocation parameters
    Object.assign(params, options.params || {})

    return params
  }
}

module.exports = Feeds

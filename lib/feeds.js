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
    return options.feedName || options.id
  }

  trigger_name (options) {
    if (!options.trigger) return

    return `/${names.parse_namespace(options.trigger)}/${names.parse_id(options.trigger)}`
  }

  invoke_options (event, options) {
    const params = this.invoke_params(event, options)

    const invoke_options = {
      id: this.feed_name(options),
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

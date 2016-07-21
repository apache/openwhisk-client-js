'use strict'

const messages = require('./messages')
const BaseOperation = require('./base_operation')

class Feeds extends BaseOperation {
  delete (options) {
    return this.feed('DELETE', options)
  }

  create (options) {
    return this.feed('CREATE', options)
  }

  feed (lifecycleEvent, options) {
    if (!options.hasOwnProperty('feedName')) {
      throw new Error(messages.MISSING_FEED_NAME_ERROR)
    }

    if (!options.hasOwnProperty('trigger')) {
      throw new Error(messages.MISSING_FEED_TRIGGER_ERROR)
    }

    const namespace = this.namespace(options)
    const params = this.params('POST', `namespaces/${namespace}/actions/${options.feedName}`)
    params.qs = {blocking: true, result: false}
    params.body = {lifecycleEvent, authKey: this.options.api_key, triggerName: options.trigger}
    Object.assign(params.body, options.params || {})

    return this.request(params)
  }
}

module.exports = Feeds

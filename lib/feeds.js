/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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

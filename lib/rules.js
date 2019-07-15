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

const Resources = require('./resources')
const messages = require('./messages')
const names = require('./names')

class Rules extends Resources {
  constructor (client) {
    super(client)
    this.resource = 'rules'
    this.identifiers.push('ruleName')
  }

  list (options) {
    options = options || {}
    options.qs = this.qs(options, ['skip', 'limit', 'count'])

    return super.list(options)
  }

  invoke () {
    throw new Error(`Operation (invoke) not supported for rule resource.`)
  }

  create (options) {
    options.qs = this.qs(options, ['overwrite'])
    options.body = this.ruleBody(options)

    return super.create(options)
  }

  ruleBody (options) {
    options = options || {}

    if (!options.hasOwnProperty('action')) {
      throw new Error(messages.MISSING_RULE_ACTION_ERROR)
    }

    if (!options.hasOwnProperty('trigger')) {
      throw new Error(messages.MISSING_RULE_TRIGGER_ERROR)
    }

    return {
      action: this.convertToFqn(options.action, options.namespace),
      trigger: this.convertToFqn(options.trigger, options.namespace)
    }
  }

  enable (options) {
    options = options || {}
    options.params = { status: 'active' }
    return super.invoke(options)
  }

  disable (options) {
    options = options || {}
    options.params = { status: 'inactive' }
    return super.invoke(options)
  }

  convertToFqn (identifier, namespace) {
    if (identifier.startsWith('/')) return identifier

    const ns = namespace || this.client.options.namespace || names.defaultNamespace()
    return `/${ns}/${identifier}`
  }
}

module.exports = Rules

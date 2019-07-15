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

const BaseOperation = require('./base_operation')
const messages = require('./messages')

class Activations extends BaseOperation {
  list (options) {
    options = options || {}
    const namespace = this.namespace(options)
    options.qs = this.qs(options || {}, ['name', 'skip', 'limit', 'upto', 'docs', 'since', 'count'])
    return this.client.request('GET', `namespaces/${namespace}/activations`, options)
  }

  get (options) {
    return this.activation(options)
  }

  logs (options) {
    return this.activation(options, 'logs')
  }

  result (options) {
    return this.activation(options, 'result')
  }

  activation (options, path) {
    const id = this.getActivation(options)
    const namespace = this.namespace(options)
    const urlPath = `namespaces/${namespace}/activations/${id}` + (path ? `/${path}` : '')
    return this.client.request('GET', urlPath, options)
  }

  getActivation (options) {
    if (typeof options === 'string') return options
    options = options || {}

    const id = options.name || options.activation || options.activationId

    if (!id) {
      throw new Error(messages.MISSING_ACTIVATION_ID_ERROR)
    }

    return id
  }
}

module.exports = Activations

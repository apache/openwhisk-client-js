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

class Namespaces extends BaseOperation {
  list (options) {
    return this.client.request('GET', 'namespaces', options)
  }

  get (options) {
    let actions = this.client.request('GET', 'namespaces/_/actions', options)
    let packages = this.client.request('GET', 'namespaces/_/packages', options)
    let triggers = this.client.request('GET', 'namespaces/_/triggers', options)
    let rules = this.client.request('GET', 'namespaces/_/rules', options)
    return Promise
      .all([actions, packages, triggers, rules])
      .then(([actions, packages, triggers, rules]) => ({ actions, packages, triggers, rules }))
  }
}

module.exports = Namespaces

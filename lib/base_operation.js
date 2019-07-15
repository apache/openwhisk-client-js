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

const names = require('./names')

class BaseOperation {
  constructor (client) {
    this.client = client
  }

  request (params) {
    const namespace = this.namespace(params.options)
    const path = this.resourcePath(namespace, params.id)
    return this.client.request(params.method, path, params.options)
  }

  resourcePath (namespace, id) {
    let path = `namespaces/${namespace}/${this.resource}`

    if (id) {
      path = `${path}/${id}`
    }

    return path
  }

  namespace (options) {
    if (options && typeof options.namespace === 'string') {
      return encodeURIComponent(options.namespace)
    }

    if (this.client.options && typeof this.client.options.namespace === 'string') {
      return encodeURIComponent(this.client.options.namespace)
    }

    return encodeURIComponent(names.defaultNamespace())
  }

  qs (options, names) {
    options = options || {}
    return names.filter(name => options.hasOwnProperty(name))
      .reduce((previous, name) => {
        previous[name] = options[name]
        return previous
      }, {})
  }
}

module.exports = BaseOperation

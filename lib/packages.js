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

class Packages extends Resources {
  constructor (client) {
    super(client)
    this.resource = 'packages'
    this.identifiers.push('packageName')
  }

  list (options) {
    options = options || {}
    options.qs = this.qs(options, ['skip', 'limit', 'public', 'count'])

    return super.list(options)
  }

  invoke () {
    throw new Error(`Operation (invoke) not supported for rule resource.`)
  }

  create (options) {
    options = this.parseOptions(options)
    options.qs = this.qs(options, ['overwrite'])
    options.body = options.package || {}

    return super.create(options)
  }
}

module.exports = Packages

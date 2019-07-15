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

const Actions = require('./actions.js')
const Activations = require('./activations.js')
const Namespaces = require('./namespaces.js')
const Packages = require('./packages.js')
const Rules = require('./rules.js')
const Triggers = require('./triggers.js')
const Feeds = require('./feeds.js')
const Routes = require('./routes.js')
const Client = require('./client.js')

const OpenWhisk = (options) => {
  const client = new Client(options)
  return {
    actions: new Actions(client),
    activations: new Activations(client),
    namespaces: new Namespaces(client),
    packages: new Packages(client),
    rules: new Rules(client),
    triggers: new Triggers(client),
    feeds: new Feeds(client),
    routes: new Routes(client)
  }
}

module.exports = OpenWhisk

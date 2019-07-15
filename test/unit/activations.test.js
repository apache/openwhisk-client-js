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

const test = require('ava')
const Activations = require('../../lib/activations')

test('list all activations', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const activations = new Activations(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/activations`)
    t.deepEqual(options, { qs: {} })
  }

  return activations.list()
})

test('list all activations with options', t => {
  t.plan(3)
  const client = {}
  const activations = new Activations(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/options_namespace/activations`)
    t.deepEqual(options.qs, { name: 'Hello', limit: 100, skip: 100, upto: 100, docs: true, since: 100 })
  }

  return activations.list({
    namespace: 'options_namespace',
    name: 'Hello',
    limit: 100,
    skip: 100,
    since: 100,
    upto: 100,
    docs: true
  })
})

test('list all activations with count parameter', t => {
  t.plan(3)
  const client = {}
  const activations = new Activations(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/options_namespace/activations`)
    t.deepEqual(options.qs, { name: 'Hello', count: true })
  }

  return activations.list({ namespace: 'options_namespace', name: 'Hello', count: true })
})

test('should retrieve an activation', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const activations = new Activations(client)
  const activationId = 'random_id'

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/activations/${activationId}`)
  }

  return activations.get({ name: activationId })
})

test('should retrieve an activation passing through user-agent header', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const activations = new Activations(client)
  const activationId = 'random_id'
  const userAgent = 'userAgentShouldPassThroughPlease'

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/activations/${activationId}`)
    t.is(options['User-Agent'], userAgent)
  }

  return activations.get({ name: activationId, 'User-Agent': userAgent })
})

test('should retrieve an activation using alt id parameter', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const activations = new Activations(client)
  const activationId = 'random_id'

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/activations/${activationId}`)
  }

  return activations.get({ activation: activationId })
})

test('should retrieve an activation using string id parameter', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const activations = new Activations(client)
  const activationId = 'random_id'

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/activations/${activationId}`)
  }

  return activations.get(activationId)
})

test('should retrieve an activation logs using string id', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const activations = new Activations(client)
  const activationId = 'random_id'

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/activations/${activationId}/logs`)
  }

  return activations.logs(activationId)
})

test('should retrieve an activation logs', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const activations = new Activations(client)
  const activationId = 'random_id'

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/activations/${activationId}/logs`)
  }

  return activations.logs({ name: activationId })
})

test('should retrieve an activation result using string id', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const activations = new Activations(client)
  const activationId = 'random_id'

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/activations/${activationId}/result`)
  }

  return activations.result(activationId)
})

test('should retrieve an activation result', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const activations = new Activations(client)
  const activationId = 'random_id'

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/activations/${activationId}/result`)
  }

  return activations.result({ name: activationId })
})

test('should throw when retrieving activation without id', t => {
  const activations = new Activations()
  return t.throws(() => {
    activations.get()
  }, /Missing mandatory/)
})

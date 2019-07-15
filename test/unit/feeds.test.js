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
const Feeds = require('../../lib/feeds')

test('should be able to delete feed', t => {
  const feedName = 'feedName'
  const apiKey = 'username:password'
  const triggerName = '/trigger_ns/triggerName'
  const client = {}
  client.options = { apiKey: apiKey }

  const ns = '_'
  const feeds = new Feeds(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/${feedName}`)
    t.deepEqual(options.qs, { blocking: true })
    t.deepEqual(options.body, {
      authKey: client.options.apiKey,
      lifecycleEvent: 'DELETE',
      triggerName: `${triggerName}`
    })
  }

  t.plan(4)

  return feeds.delete({ name: feedName, trigger: triggerName })
})

test('should be able to delete feed using feedName with params', t => {
  const feedName = 'feedName'
  const apiKey = 'username:password'
  const triggerName = 'triggerName'
  const client = {}
  client.options = { apiKey: apiKey }

  const ns = '_'
  const feeds = new Feeds(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/${feedName}`)
    t.deepEqual(options.qs, { blocking: true })
    t.deepEqual(options.body, {
      foo: 'bar',
      authKey: client.options.apiKey,
      lifecycleEvent: 'DELETE',
      triggerName: `/_/${triggerName}`
    })
  }

  t.plan(4)

  const params = { foo: 'bar' }
  return feeds.delete({ feedName: feedName, trigger: triggerName, params })
})

test('should be able to create feed', t => {
  const feedName = 'feedName'
  const apiKey = 'username:password'
  const triggerName = '/trigger_ns/triggerName'
  const client = {}
  client.options = { apiKey: apiKey }

  const ns = '_'
  const feeds = new Feeds(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/${feedName}`)
    t.deepEqual(options.qs, { blocking: true })
    t.deepEqual(options.body, {
      authKey: client.options.apiKey,
      lifecycleEvent: 'CREATE',
      triggerName: `${triggerName}`
    })
  }

  t.plan(4)

  return feeds.create({ name: feedName, trigger: triggerName })
})

test('should be able to create trigger ignoring global namespace', t => {
  const feedName = 'feedName'
  const apiKey = 'username:password'
  const triggerName = '/a/triggerName'
  const client = {}
  client.options = { apiKey: apiKey, namespace: 'global_ns' }

  const ns = 'global_ns'
  const feeds = new Feeds(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/${feedName}`)
    t.deepEqual(options.qs, { blocking: true })
    t.deepEqual(options.body, {
      authKey: client.options.apiKey,
      lifecycleEvent: 'CREATE',
      triggerName: `${triggerName}`
    })
  }

  t.plan(4)

  return feeds.create({ name: feedName, trigger: triggerName })
})

test('should be able to create trigger using global namespace', t => {
  const feedName = 'feedName'
  const apiKey = 'username:password'
  const triggerName = 'triggerName'
  const client = {}
  client.options = { apiKey: apiKey, namespace: 'global_ns' }

  const ns = 'global_ns'
  const feeds = new Feeds(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/${feedName}`)
    t.deepEqual(options.qs, { blocking: true })
    t.deepEqual(options.body, {
      authKey: client.options.apiKey,
      lifecycleEvent: 'CREATE',
      triggerName: `/global_ns/${triggerName}`
    })
  }

  t.plan(4)

  return feeds.create({ name: feedName, trigger: triggerName })
})

test('should be able to create trigger using options namespace', t => {
  const feedName = 'feedName'
  const apiKey = 'username:password'
  const triggerName = 'triggerName'
  const client = {}
  client.options = { apiKey: apiKey }

  const ns = 'custom'
  const feeds = new Feeds(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/${feedName}`)
    t.deepEqual(options.qs, { blocking: true })
    t.deepEqual(options.body, {
      authKey: client.options.apiKey,
      lifecycleEvent: 'CREATE',
      triggerName: `/_/${triggerName}`
    })
  }

  t.plan(4)

  return feeds.create({ name: feedName, namespace: ns, trigger: triggerName })
})

test('should be able to create trigger ignoring options namespace', t => {
  const feedName = 'feedName'
  const apiKey = 'username:password'
  const triggerName = '/a/triggerName'
  const client = {}
  client.options = { apiKey: apiKey }

  const feeds = new Feeds(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/ns/actions/${feedName}`)
    t.deepEqual(options.qs, { blocking: true })
    t.deepEqual(options.body, {
      authKey: client.options.apiKey,
      lifecycleEvent: 'CREATE',
      triggerName: `${triggerName}`
    })
  }

  t.plan(4)

  return feeds.create({ name: feedName, namespace: 'ns', trigger: triggerName })
})

test('should be able to create trigger from full qualified feed', t => {
  const feedName = '/b/c/feedName'
  const apiKey = 'username:password'
  const triggerName = '/a/triggerName'
  const client = {}
  client.options = { apiKey: apiKey, namespace: 'global' }

  const feeds = new Feeds(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/b/actions/c/feedName`)
    t.deepEqual(options.qs, { blocking: true })
    t.deepEqual(options.body, {
      authKey: client.options.apiKey,
      lifecycleEvent: 'CREATE',
      triggerName: `${triggerName}`
    })
  }

  t.plan(4)

  return feeds.create({ name: feedName, namespace: 'ns', trigger: triggerName })
})

test('should be able to create feed using feedName with params', t => {
  const feedName = 'feedName'
  const apiKey = 'username:password'
  const triggerName = 'triggerName'
  const client = {}
  client.options = { apiKey: apiKey }

  const ns = '_'
  const feeds = new Feeds(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/${feedName}`)
    t.deepEqual(options.qs, { blocking: true })
    t.deepEqual(options.body, {
      foo: 'bar',
      authKey: client.options.apiKey,
      lifecycleEvent: 'CREATE',
      triggerName: `/_/${triggerName}`
    })
  }

  t.plan(4)

  const params = { foo: 'bar' }
  return feeds.create({ feedName: feedName, trigger: triggerName, params })
})

test('should be able to get feed', t => {
  const feedName = 'feedName'
  const apiKey = 'username:password'
  const triggerName = '/trigger_ns/triggerName'
  const client = {}
  client.options = { apiKey: apiKey }

  const ns = '_'
  const feeds = new Feeds(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/${feedName}`)
    t.deepEqual(options.qs, { blocking: true })
    t.deepEqual(options.body, { authKey: client.options.apiKey, lifecycleEvent: 'READ', triggerName: `${triggerName}` })
  }

  t.plan(4)

  return feeds.get({ name: feedName, trigger: triggerName })
})

test('should be able to update feed', t => {
  const feedName = 'feed_name'
  const apiKey = 'username:password'
  const triggerName = '/trigger_ns/trigger_name'
  const client = {}
  client.options = { api_key: apiKey }

  const ns = '_'
  const feeds = new Feeds(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/${feedName}`)
    t.deepEqual(options.qs, { blocking: true })
    t.deepEqual(options.body, { authKey: client.options.apiKey, lifecycleEvent: 'UPDATE', triggerName: `${triggerName}` })
  }

  t.plan(4)

  return feeds.update({ name: feedName, trigger: triggerName })
})

test('should throw errors without trigger parameter ', t => {
  const client = { options: {} }
  const feeds = new Feeds(client)
  t.throws(() => feeds.feed('', { feedName: 'myFeed' }), /trigger/)
})

test('should throw errors without id parameter', t => {
  const client = { options: {} }
  const feeds = new Feeds(client)
  t.throws(() => feeds.feed('', { trigger: 'myFeed' }), /feedName/)
})

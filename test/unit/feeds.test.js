// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

'use strict'

const test = require('ava')
const Feeds = require('../../lib/feeds')

test('should be able to delete feed', t => {
  const feed_name = 'feed_name'
  const api_key = 'username:password'
  const trigger_name = '/trigger_ns/trigger_name'
  const client = {}
  client.options = { api_key }

  const ns = '_'
  const feeds = new Feeds(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/${feed_name}`)
    t.deepEqual(options.qs, {blocking: true})
    t.deepEqual(options.body, {authKey: client.options.api_key, lifecycleEvent: 'DELETE', triggerName: `${trigger_name}`})
  }

  t.plan(4)

  return feeds.delete({name: feed_name, trigger: trigger_name})
})

test('should be able to delete feed using feedName with params', t => {
  const feed_name = 'feed_name'
  const api_key = 'username:password'
  const trigger_name = 'trigger_name'
  const client = {}
  client.options = { api_key }

  const ns = '_'
  const feeds = new Feeds(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/${feed_name}`)
    t.deepEqual(options.qs, {blocking: true})
    t.deepEqual(options.body, {foo: 'bar', authKey: client.options.api_key, lifecycleEvent: 'DELETE', triggerName: `/_/${trigger_name}`})
  }

  t.plan(4)

  const params = {foo: 'bar'}
  return feeds.delete({feedName: feed_name, trigger: trigger_name, params})
})

test('should be able to create feed', t => {
  const feed_name = 'feed_name'
  const api_key = 'username:password'
  const trigger_name = '/trigger_ns/trigger_name'
  const client = {}
  client.options = { api_key }

  const ns = '_'
  const feeds = new Feeds(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/${feed_name}`)
    t.deepEqual(options.qs, {blocking: true})
    t.deepEqual(options.body, {authKey: client.options.api_key, lifecycleEvent: 'CREATE', triggerName: `${trigger_name}`})
  }

  t.plan(4)

  return feeds.create({name: feed_name, trigger: trigger_name})
})

test('should be able to create trigger ignoring global namespace', t => {
  const feed_name = 'feed_name'
  const api_key = 'username:password'
  const trigger_name = '/a/trigger_name'
  const client = {}
  client.options = { api_key, namespace: 'global_ns' }

  const ns = 'global_ns'
  const feeds = new Feeds(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/${feed_name}`)
    t.deepEqual(options.qs, {blocking: true})
    t.deepEqual(options.body, {authKey: client.options.api_key, lifecycleEvent: 'CREATE', triggerName: `${trigger_name}`})
  }

  t.plan(4)

  return feeds.create({name: feed_name, trigger: trigger_name})
})

test('should be able to create trigger using global namespace', t => {
  const feed_name = 'feed_name'
  const api_key = 'username:password'
  const trigger_name = 'trigger_name'
  const client = {}
  client.options = { api_key, namespace: 'global_ns' }

  const ns = 'global_ns'
  const feeds = new Feeds(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/${feed_name}`)
    t.deepEqual(options.qs, {blocking: true})
    t.deepEqual(options.body, {authKey: client.options.api_key, lifecycleEvent: 'CREATE', triggerName: `/global_ns/${trigger_name}`})
  }

  t.plan(4)

  return feeds.create({name: feed_name, trigger: trigger_name})
})

test('should be able to create trigger using options namespace', t => {
  const feed_name = 'feed_name'
  const api_key = 'username:password'
  const trigger_name = 'trigger_name'
  const client = {}
  client.options = { api_key }

  const ns = 'custom'
  const feeds = new Feeds(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/${feed_name}`)
    t.deepEqual(options.qs, {blocking: true})
    t.deepEqual(options.body, {authKey: client.options.api_key, lifecycleEvent: 'CREATE', triggerName: `/_/${trigger_name}`})
  }

  t.plan(4)

  return feeds.create({name: feed_name, namespace: ns, trigger: trigger_name})
})

test('should be able to create trigger ignoring options namespace', t => {
  const feed_name = 'feed_name'
  const api_key = 'username:password'
  const trigger_name = '/a/trigger_name'
  const client = {}
  client.options = { api_key }

  const ns = '_'
  const feeds = new Feeds(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/ns/actions/${feed_name}`)
    t.deepEqual(options.qs, {blocking: true})
    t.deepEqual(options.body, {authKey: client.options.api_key, lifecycleEvent: 'CREATE', triggerName: `${trigger_name}`})
  }

  t.plan(4)

  return feeds.create({name: feed_name, namespace: 'ns', trigger: trigger_name})
})

test('should be able to create trigger from full qualified feed', t => {
  const feed_name = '/b/c/feed_name'
  const api_key = 'username:password'
  const trigger_name = '/a/trigger_name'
  const client = {}
  client.options = { api_key, namespace: 'global' }

  const ns = '_'
  const feeds = new Feeds(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/b/actions/c/feed_name`)
    t.deepEqual(options.qs, {blocking: true})
    t.deepEqual(options.body, {authKey: client.options.api_key, lifecycleEvent: 'CREATE', triggerName: `${trigger_name}`})
  }

  t.plan(4)

  return feeds.create({name: feed_name, namespace: 'ns', trigger: trigger_name})
})

test('should be able to create feed using feedName with params', t => {
  const feed_name = 'feed_name'
  const api_key = 'username:password'
  const trigger_name = 'trigger_name'
  const client = {}
  client.options = { api_key }

  const ns = '_'
  const feeds = new Feeds(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/${feed_name}`)
    t.deepEqual(options.qs, {blocking: true})
    t.deepEqual(options.body, {foo: 'bar', authKey: client.options.api_key, lifecycleEvent: 'CREATE', triggerName: `/_/${trigger_name}`})
  }

  t.plan(4)

  const params = {foo: 'bar'}
  return feeds.create({feedName: feed_name, trigger: trigger_name, params})
})

test('should be able to get feed', t => {
  const feed_name = 'feed_name'
  const api_key = 'username:password'
  const trigger_name = '/trigger_ns/trigger_name'
  const client = {}
  client.options = { api_key }

  const ns = '_'
  const feeds = new Feeds(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/${feed_name}`)
    t.deepEqual(options.qs, {blocking: true})
    t.deepEqual(options.body, {authKey: client.options.api_key, lifecycleEvent: 'READ', triggerName: `${trigger_name}`})
  }

  t.plan(4)

  return feeds.get({name: feed_name, trigger: trigger_name})
})

test('should throw errors without trigger parameter ', t => {
  const ns = '_'
  const client = { options: {} }
  const feeds = new Feeds(client)
  t.throws(() => feeds.feed('', {feedName: 'myFeed'}), /trigger/)
})

test('should throw errors without id parameter', t => {
  const ns = '_'
  const client = { options: {} }
  const feeds = new Feeds(client)
  t.throws(() => feeds.feed('', {trigger: 'myFeed'}), /feedName/)
})

'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')
const stub = {}
const ctor = function (options) { this.options = options }
ctor.prototype = stub

const Feeds = proxyquire('../../lib/feeds.js', {'./base_operation': ctor})

test('delete feed using default namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const feed_name = 'rule_name'
  const trigger_name = 'trigger_ns/trigger_name'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/actions/${feed_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'POST')
    t.deepEqual(req.body, {authKey: params.api_key, lifecycleEvent: 'DELETE', triggerName: `${trigger_name}`})
    t.deepEqual(req.qs, {blocking: true, result: false})
    return Promise.resolve()
  }

  t.plan(5)

  const feeds = new Feeds(params)
  return feeds.delete({feedName: feed_name, trigger: trigger_name})
})

test('delete feed using custom namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const feed_name = 'rule_name'
  const trigger_name = 'trigger_ns/trigger_name'
  const namespace = 'custom_namespace'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${namespace}/actions/${feed_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'POST')
    t.deepEqual(req.body, {authKey: params.api_key, lifecycleEvent: 'DELETE', triggerName: `${trigger_name}`})
    t.deepEqual(req.qs, {blocking: true, result: false})
    return Promise.resolve()
  }

  t.plan(5)

  const feeds = new Feeds(params)
  return feeds.delete({feedName: feed_name, trigger: trigger_name, namespace: namespace})
})

test('should throw errors without trigger parameter on create', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const feeds = new Feeds(params)
  t.throws(() => feeds.create({feedName: 'myFeed'}), /trigger/)
})

test('should throw errors without feed name parameter on create', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const feeds = new Feeds(params)
  t.throws(() => feeds.create({}), /feedName/)
})

test('should throw errors without trigger parameter on delete', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const feeds = new Feeds(params)
  t.throws(() => feeds.delete({feedName: 'myFeed'}), /trigger/)
})

test('should throw errors without feed name parameter on delete', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const feeds = new Feeds(params)
  t.throws(() => feeds.delete({}), /feedName/)
})

// must pass params

test('create feed using default namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const feed_name = 'rule_name'
  const trigger_name = 'trigger_ns/trigger_name'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/actions/${feed_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'POST')
    t.deepEqual(req.body, {authKey: params.api_key, lifecycleEvent: 'CREATE', triggerName: `${trigger_name}`})
    t.deepEqual(req.qs, {blocking: true, result: false})
    return Promise.resolve()
  }

  t.plan(5)

  const feeds = new Feeds(params)
  return feeds.create({feedName: feed_name, trigger: trigger_name})
})

test('create feed with custom parameters', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const feed_name = 'rule_name'
  const trigger_name = 'trigger_ns/trigger_name'
  const custom_params = {hello: 'world'}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/actions/${feed_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'POST')
    t.deepEqual(req.body, {hello: 'world', authKey: params.api_key, lifecycleEvent: 'CREATE', triggerName: `${trigger_name}`})
    t.deepEqual(req.qs, {blocking: true, result: false})
    return Promise.resolve()
  }

  t.plan(5)

  const feeds = new Feeds(params)
  return feeds.create({feedName: feed_name, trigger: trigger_name, params: custom_params})
})

test('create feed using options namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const feed_name = 'rule_name'
  const trigger_name = 'trigger_ns/trigger_name'
  const namespace = 'custom_namespace'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${namespace}/actions/${feed_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'POST')
    t.deepEqual(req.body, {authKey: params.api_key, lifecycleEvent: 'CREATE', triggerName: `${trigger_name}`})
    t.deepEqual(req.qs, {blocking: true, result: false})
    return Promise.resolve()
  }

  t.plan(5)

  const feeds = new Feeds(params)
  return feeds.create({feedName: feed_name, trigger: trigger_name, namespace: namespace})
})

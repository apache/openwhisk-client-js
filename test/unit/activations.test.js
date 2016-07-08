'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')
const stub = {}
const ctor = function (options) { this.options = options }
ctor.prototype = stub

const Activations = proxyquire('../../lib/activations.js', {'./base_operation': ctor})

test('list all activations', t => {
  const namespace = 'default_namespace'
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: namespace}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${namespace}/activations`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(3)

  const activations = new Activations(params)
  return activations.list()
})

test('list all activations with options', t => {
  const namespace = 'default_namespace'
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: namespace}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/options_namespace/activations`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'GET')
    t.deepEqual(req.qs, {name: 'Hello', limit: 100, skip: 100, upto: 100, docs: true})
    return Promise.resolve()
  }

  t.plan(4)

  const activations = new Activations(params)
  return activations.list({namespace: 'options_namespace', name: 'Hello', limit: 100, skip: 100, since: 100, upto: 100, docs: true})
})

test('get an activation', t => {
  const namespace = 'default_namespace'
  const activation_id = 'random_id'
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: namespace}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${namespace}/activations/${activation_id}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(3)

  const activations = new Activations(params)
  return activations.get({activation: activation_id})
})

test('get an activation logs', t => {
  const namespace = 'default_namespace'
  const activation_id = 'random_id'
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: namespace}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${namespace}/activations/${activation_id}/logs`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(3)

  const activations = new Activations(params)
  return activations.logs({activation: activation_id})
})

test('get an activation result', t => {
  const namespace = 'default_namespace'
  const activation_id = 'random_id'
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: namespace}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${namespace}/activations/${activation_id}/result`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(3)

  const activations = new Activations(params)
  return activations.result({activation: activation_id})
})

test('get an activation without providing an id', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'hello'}

  stub.request = req => {
    t.fail()
  }

  const activations = new Activations(params)
  return t.throws(() => { activations.get() }, /Missing mandatory activation/)
})

test('list all activations without providing a namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const activations = new Activations(params)
  return t.throws(() => { activations.list() }, /Missing namespace/)
})

/*
test('get namespace passed in options', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/standard`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(3)

  const namespaces = new Namespaces(params)
  return namespaces.get({namespace: 'standard'})
})

test('get default namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'standard'}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/standard`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(3)

  const namespaces = new Namespaces(params)
  return namespaces.get()
})

test('get a namespace without providing any namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const namespaces = new Namespaces(params)
  return t.throws(() => { namespaces.get() }, /Missing namespace/)
})
*/

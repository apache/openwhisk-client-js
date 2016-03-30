'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')
const stub = {}
const ctor = function (options) { this.options = options }
ctor.prototype = stub

const Namespaces = proxyquire('../../lib/namespaces.js', {'./base_operation': ctor})

test('list all namespaces', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(3)

  const namespaces = new Namespaces(params)
  return namespaces.list()
})

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

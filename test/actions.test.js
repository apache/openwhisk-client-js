'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')
const stub = {}

const Actions = proxyquire('../lib/actions.js', { 'request-promise': stub})

test('list all actions using default namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const result = [{
    namespace: 'default',
    name: 'action_name',
    version: '0.0.1',
    publish: true
  }]

  stub.get = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/actions`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    return Promise.resolve(result)
  }

  t.plan(3)

  const actions = new Actions(params)
  return actions.list().then(results => {
    t.same(results, result)
  }).catch(() => t.fail())
})

test('list all actions using provided namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const result = [{
    namespace: 'default',
    name: 'action_name',
    version: '0.0.1',
    publish: true
  }]

  const options = {namespace: 'not_default'}
  stub.get = req => {
    t.is(req.url, `${params.api}namespaces/${options.namespace}/actions`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    return Promise.resolve(result)
  }

  t.plan(3)

  const actions = new Actions(params)
  return actions.list(options).then(results => {
    t.same(results, result)
  }).catch(() => t.fail())
})

test('list all actions using limit and skip parameters', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const result = [{
    namespace: 'default',
    name: 'action_name',
    version: '0.0.1',
    publish: true
  }]

  const options = {limit: 100, skip: 50}
  stub.get = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/actions`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.same(req.qs, options)
    return Promise.resolve(result)
  }

  t.plan(4)

  const actions = new Actions(params)
  return actions.list(options).then(results => {
    t.same(results, result)
  }).catch(() => t.fail())
})

test('list all actions without providing any namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.get = req => {
    t.fail()
  }

  const actions = new Actions(params)
  return t.throws(actions.list())
})

test('throw error for invalid authorization', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', namespace: 'default', api_key: 'user_authorisation_key'}

  stub.get = req => {
    return Promise.reject({statusCode: 401})
  }

  const actions = new Actions(params)
  return t.throws(actions.list(), /authentication failed/)
})

test('throw error for missing url endpoint', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', namespace: 'default', api_key: 'user_authorisation_key'}

  stub.get = req => {
    return Promise.reject({statusCode: 404})
  }

  const actions = new Actions(params)
  return t.throws(actions.list(), /404/)
})

test('throw error for openwhisk 5xx response', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', namespace: 'default', api_key: 'user_authorisation_key'}

  stub.get = req => {
    return Promise.reject({statusCode: 500})
  }

  const actions = new Actions(params)
  return t.throws(actions.list(), /error HTTP code/)
})

test('throw error for request errors', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', namespace: 'default', api_key: 'user_authorisation_key'}

  stub.get = req => {
    return Promise.reject({message: 'error reason'})
  }

  const actions = new Actions(params)
  return t.throws(actions.list(), /error reason/)
})

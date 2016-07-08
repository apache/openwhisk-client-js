'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')
const stub = {}
const ctor = function (options) { this.options = options }
ctor.prototype = stub

const Triggers = proxyquire('../../lib/triggers.js', {'./base_operation': ctor})

test('list all triggers', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/triggers`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(3)

  const triggers = new Triggers(params)
  return triggers.list()
})

test('list all triggers with options', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const options = {limit: 100, skip: 50, namespace: 'sample'}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${options.namespace}/triggers`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.deepEqual(req.qs, {limit: 100, skip: 50})
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(4)

  const triggers = new Triggers(params)
  return triggers.list(options)
})

test('list all triggers without providing any namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const triggers = new Triggers(params)
  return t.throws(() => { triggers.list() }, /Missing namespace/)
})

test('get trigger using default namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const trigger_name = 'trigger_name'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/triggers/${trigger_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(3)

  const triggers = new Triggers(params)
  return triggers.get({triggerName: trigger_name})
})

test('get trigger using options namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const trigger_name = 'trigger_name'
  const namespace = 'provided'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${namespace}/triggers/${trigger_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(3)

  const triggers = new Triggers(params)
  return triggers.get({triggerName: trigger_name, namespace: 'provided'})
})

test('get an trigger without providing any namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const triggers = new Triggers(params)
  return t.throws(() => { triggers.get({triggerName: 'custom'}) }, /Missing namespace/)
})

test('get a trigger without providing a trigger name', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const triggers = new Triggers(params)
  return t.throws(() => { triggers.get({namespace: 'custom'}) }, /triggerName/)
})

test('delete trigger using default namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const trigger_name = 'trigger_name'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/triggers/${trigger_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'DELETE')
    return Promise.resolve()
  }

  t.plan(3)

  const triggers = new Triggers(params)
  return triggers.delete({triggerName: trigger_name})
})

test('delete trigger using options namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const trigger_name = 'trigger_name'
  const namespace = 'provided'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${namespace}/triggers/${trigger_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'DELETE')
    return Promise.resolve()
  }

  t.plan(3)

  const triggers = new Triggers(params)
  return triggers.delete({triggerName: trigger_name, namespace: 'provided'})
})

test('delete an trigger without providing any namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const triggers = new Triggers(params)
  return t.throws(() => { triggers.delete({triggerName: 'custom'}) }, /Missing namespace/)
})

test('delete an trigger without providing an trigger name', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const triggers = new Triggers(params)
  return t.throws(() => { triggers.delete({namespace: 'custom'}) }, /triggerName/)
})

test('create a new trigger using the default namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const trigger_name = 'trigger_name'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/triggers/${trigger_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'PUT')
    t.is(Object.keys(req.body).length, 0)
    t.deepEqual(req.qs, {})
    return Promise.resolve()
  }

  t.plan(5)

  const triggers = new Triggers(params)
  return triggers.create({triggerName: trigger_name})
})

test('create an trigger using options namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const trigger_name = 'trigger_name'
  const namespace = 'provided'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${namespace}/triggers/${trigger_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'PUT')
    t.is(Object.keys(req.body).length, 0)
    t.deepEqual(req.qs, {overwrite: true})
    return Promise.resolve()
  }

  t.plan(5)

  const triggers = new Triggers(params)
  return triggers.create({triggerName: trigger_name, namespace: 'provided', overwrite: true})
})

test('create an trigger without providing any namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const triggers = new Triggers(params)
  return t.throws(() => { triggers.create({triggerName: 'custom', trigger: ''}) }, /Missing namespace/)
})

test('create an trigger without providing an trigger name', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const triggers = new Triggers(params)
  return t.throws(() => { triggers.create({namespace: 'custom', trigger: ''}) }, /triggerName/)
})

test('update an trigger', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const trigger_name = 'trigger_name'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/triggers/${trigger_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'PUT')
    t.is(Object.keys(req.body).length, 0)
    t.deepEqual(req.qs, {overwrite: true})
    return Promise.resolve()
  }

  t.plan(5)

  const triggers = new Triggers(params)
  return triggers.update({triggerName: trigger_name})
})

test('invoke an trigger with no parameters', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const trigger_name = 'trigger_name'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/triggers/${trigger_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'POST')
    t.is(Object.keys(req.body).length, 0)
    return Promise.resolve()
  }

  t.plan(4)

  const triggers = new Triggers(params)
  return triggers.invoke({triggerName: trigger_name})
})

test('invoke an trigger with JSON string', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const trigger_name = 'trigger_name'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/triggers/${trigger_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'POST')
    t.deepEqual(req.body, {})
    return Promise.resolve()
  }

  t.plan(4)

  const triggers = new Triggers(params)
  return triggers.invoke({triggerName: trigger_name, payload: '{}'})
})

test('invoke an trigger with object', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const trigger_name = 'trigger_name'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/triggers/${trigger_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'POST')
    t.deepEqual(req.body, {a: 1, b: 2})
    return Promise.resolve()
  }

  t.plan(4)

  const triggers = new Triggers(params)
  return triggers.invoke({triggerName: trigger_name, params: {a: 1, b: 2}})
})

'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')
const stub = {}
const ctor = function (options) { this.options = options }
ctor.prototype = stub

const Actions = proxyquire('../../lib/actions.js', {'./base_operation': ctor})

test('list all actions using default namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/actions`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(3)

  const actions = new Actions(params)
  return actions.list()
})

test('list all actions using skip and limit parameters', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const options = {limit: 100, skip: 50}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/actions`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.deepEqual(req.qs, options)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(4)

  const actions = new Actions(params)
  return actions.list(options)
})

test('list all actions using provided namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const namespace = 'provided'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${namespace}/actions`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(3)

  const actions = new Actions(params)
  return actions.list({namespace: namespace})
})

test('list all actions without providing any namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const actions = new Actions(params)
  return t.throws(() => { actions.list() }, /Missing namespace/)
})

test('get action using default namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const action_name = 'action_name'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/actions/${action_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(3)

  const actions = new Actions(params)
  return actions.get({actionName: action_name})
})

test('get action using options namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const action_name = 'action_name'
  const namespace = 'provided'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${namespace}/actions/${action_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(3)

  const actions = new Actions(params)
  return actions.get({actionName: action_name, namespace: 'provided'})
})

test('get an action without providing any namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const actions = new Actions(params)
  return t.throws(() => { actions.get({actionName: 'custom'}) }, /Missing namespace/)
})

test('get an action without providing an action name', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const actions = new Actions(params)
  return t.throws(() => { actions.get({namespace: 'custom'}) }, /actionName/)
})

test('delete action using default namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const action_name = 'action_name'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/actions/${action_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'DELETE')
    return Promise.resolve()
  }

  t.plan(3)

  const actions = new Actions(params)
  return actions.delete({actionName: action_name})
})

test('delete action using options namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const action_name = 'action_name'
  const namespace = 'provided'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${namespace}/actions/${action_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'DELETE')
    return Promise.resolve()
  }

  t.plan(3)

  const actions = new Actions(params)
  return actions.delete({actionName: action_name, namespace: 'provided'})
})

test('delete an action without providing any namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const actions = new Actions(params)
  return t.throws(() => { actions.delete({actionName: 'custom'}) }, /Missing namespace/)
})

test('delete an action without providing an action name', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const actions = new Actions(params)
  return t.throws(() => { actions.delete({namespace: 'custom'}) }, /actionName/)
})

test('create a new action using the default namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const action_name = 'action_name'
  const action = 'function main() { // main function body};'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/actions/${action_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'PUT')
    t.deepEqual(req.body, {exec: {kind: 'nodejs', code: action}})
    t.deepEqual(req.qs, {})
    return Promise.resolve()
  }

  t.plan(5)

  const actions = new Actions(params)
  return actions.create({actionName: action_name, action: action})
})

test('create an action using options namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const action_name = 'action_name'
  const namespace = 'provided'
  const action = 'function main() { // main function body};'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${namespace}/actions/${action_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'PUT')
    t.deepEqual(req.body, {exec: {kind: 'nodejs', code: action}})
    t.deepEqual(req.qs, {overwrite: true})
    return Promise.resolve()
  }

  t.plan(5)

  const actions = new Actions(params)
  return actions.create({actionName: action_name, namespace: 'provided', action: action, overwrite: true})
})

test('create an action with custom body', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const action_name = 'action_name'
  const namespace = 'provided'
  const code = 'function main() { // main function body};'
  const action = {exec: {kind: 'swift', code: code}}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${namespace}/actions/${action_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'PUT')
    t.deepEqual(req.body, {exec: {kind: 'swift', code: code}})
    t.deepEqual(req.qs, {overwrite: true})
    return Promise.resolve()
  }

  t.plan(5)

  const actions = new Actions(params)
  return actions.create({actionName: action_name, namespace: 'provided', action: action, overwrite: true})
})

test('create an action without providing any namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const actions = new Actions(params)
  return t.throws(() => { actions.create({actionName: 'custom', action: ''}) }, /Missing namespace/)
})

test('create an action without providing an action name', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const actions = new Actions(params)
  return t.throws(() => { actions.create({namespace: 'custom', action: ''}) }, /actionName/)
})

test('create an action without providing an action body', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const actions = new Actions(params)
  return t.throws(() => { actions.create({namespace: 'custom', actionName: 'hello'}) }, /action/)
})

test('update an action', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const action_name = 'action_name'
  const action = 'function main() { // main function body};'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/actions/${action_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'PUT')
    t.deepEqual(req.body, {exec: {kind: 'nodejs', code: action}})
    t.deepEqual(req.qs, {overwrite: true})
    return Promise.resolve()
  }

  t.plan(5)

  const actions = new Actions(params)
  return actions.update({actionName: action_name, action: action})
})

test('invoke an action with no parameters', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const action_name = 'action_name'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/actions/${action_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'POST')
    t.deepEqual(req.body, {})
    return Promise.resolve()
  }

  t.plan(4)

  const actions = new Actions(params)
  return actions.invoke({actionName: action_name})
})

test('invoke an action with JSON string', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const action_name = 'action_name'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/actions/${action_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'POST')
    t.deepEqual(req.body, {})
    return Promise.resolve()
  }

  t.plan(4)

  const actions = new Actions(params)
  return actions.invoke({actionName: action_name, payload: '{}'})
})

test('invoke an action with object', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const action_name = 'action_name'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/actions/${action_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'POST')
    t.deepEqual(req.body, {a: 1, b: 2})
    return Promise.resolve()
  }

  t.plan(4)

  const actions = new Actions(params)
  return actions.invoke({actionName: action_name, params: {a: 1, b: 2}})
})

test('invoke an action (blocking)', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const action_name = 'action_name'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/actions/${action_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'POST')
    t.deepEqual(req.body, {})
    t.deepEqual(req.qs, {blocking: true})
    return Promise.resolve()
  }

  t.plan(5)

  const actions = new Actions(params)
  return actions.invoke({actionName: action_name, blocking: true})
})

'use strict'

const test = require('ava')
const Actions = require('../../lib/actions')

test('should list all actions without parameters', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/actions`)
    t.deepEqual(options, {qs: {}})
  }

  return actions.list()
})

test('should list all actions with parameters', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/custom/actions`)
    t.deepEqual(options.qs, {skip: 100, limit: 100})
  }

  return actions.list({namespace: 'custom', skip: 100, limit: 100})
})

test('should retrieve action from identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/actions/12345`)
  }

  return actions.get({id: '12345'})
})

test('should delete action from identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'DELETE')
    t.is(path, `namespaces/${ns}/actions/12345`)
  }

  return actions.delete({id: '12345'})
})

test('should retrieve actionName from identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/actions/12345`)
  }

  return actions.get({actionName: '12345'})
})

test('should invoke action', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {})
  }

  return actions.invoke({id: '12345'})
})

test('should invoke fully qualified action', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/custom/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {})
  }

  return actions.invoke({id: '/custom/12345'})
})

test('should invoke fully qualified action with package', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/custom/actions/package/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {})
  }

  return actions.invoke({id: '/custom/package/12345'})
})

test('should invoke blocking action with body', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {blocking: true})
    t.deepEqual(options.body, {foo: 'bar'})
  }

  return actions.invoke({id: '12345', blocking: true, params: {foo: 'bar'}})
})

test('should invoke blocking action using actionName', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {})
  }

  return actions.invoke({actionName: '12345'})
})

test('create a new action', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const action = 'function main() { // main function body};'
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {exec: {kind: 'nodejs:default', code: action}})
  }

  return actions.create({id: '12345', action})
})

test('create a new action with custom body', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const code = 'function main() { // main function body};'
  const action = {exec: {kind: 'swift', code: code}}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, action)
  }

  return actions.create({id: '12345', action})
})

test('create a new action with buffer body', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const action = new Buffer('some action source contents')
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {exec: {kind: 'nodejs:default', code: action.toString('base64')}})
  }

  return actions.create({id: '12345', action})
})

test('create an action without providing an action body', t => {
  const actions = new Actions()
  t.throws(() => actions.create({id: '12345'}), /Missing mandatory action/)
})

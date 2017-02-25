'use strict'

const test = require('ava')
const Triggers = require('../../lib/triggers')

test('should list all triggers without parameters', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const triggers = new Triggers(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/triggers`)
    t.deepEqual(options, {qs: {}})
  }

  return triggers.list()
})

test('should list all triggers with parameters', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const triggers = new Triggers(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/custom/triggers`)
    t.deepEqual(options.qs, {skip: 100, limit: 100})
  }

  return triggers.list({namespace: 'custom', skip: 100, limit: 100})
})

test('should retrieve trigger from identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const triggers = new Triggers(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/triggers/12345`)
  }

  return triggers.get({name: '12345'})
})

test('should delete trigger from identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const triggers = new Triggers(client)

  client.request = (method, path, options) => {
    t.is(method, 'DELETE')
    t.is(path, `namespaces/${ns}/triggers/12345`)
  }

  return triggers.delete({name: '12345'})
})

test('should retrieve triggerName from identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const triggers = new Triggers(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/triggers/12345`)
  }

  return triggers.get({triggerName: '12345'})
})

test('should invoke trigger', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const triggers = new Triggers(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/triggers/12345`)
    t.deepEqual(options.body, {})
  }

  return triggers.invoke({name: '12345'})
})

test('should invoke fully qualified trigger', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const triggers = new Triggers(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/custom/triggers/12345`)
    t.deepEqual(options.body, {})
  }

  return triggers.invoke({name: '/custom/12345'})
})

test('should invoke fully qualified trigger with package', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const triggers = new Triggers(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/custom/triggers/package/12345`)
    t.deepEqual(options.body, {})
  }

  return triggers.invoke({name: '/custom/package/12345'})
})

test('should invoke trigger with body', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const triggers = new Triggers(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/triggers/12345`)
    t.deepEqual(options.body, {foo: 'bar'})
  }

  return triggers.invoke({name: '12345', params: {foo: 'bar'}})
})

test('should invoke trigger using triggerName', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const triggers = new Triggers(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/triggers/12345`)
    t.deepEqual(options.body, {})
  }

  return triggers.invoke({triggerName: '12345'})
})

test('create a new trigger', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const triggers = new Triggers(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/triggers/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {})
  }

  return triggers.create({name: '12345'})
})

test('create a new trigger with custom body', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const trigger = { foo: 'bar' }
  const triggers = new Triggers(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/triggers/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, trigger)
  }

  return triggers.create({name: '12345', trigger})
})

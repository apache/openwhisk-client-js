'use strict'

const test = require('ava')
const Activations = require('../../lib/activations')

test('list all activations', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const activations = new Activations(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/activations`)
    t.deepEqual(options, {qs: {}})
  }

  return activations.list()
})

test('list all activations', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const activations = new Activations(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/options_namespace/activations`)
    t.deepEqual(options.qs, {name: 'Hello', limit: 100, skip: 100, upto: 100, docs: true, since: 100})
  }

  return activations.list({namespace: 'options_namespace', name: 'Hello', limit: 100, skip: 100, since: 100, upto: 100, docs: true})
})

test('should retrieve an activation', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const activations = new Activations(client)
  const activation_id = 'random_id'

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/activations/${activation_id}`)
  }

  return activations.get({id: activation_id})
})

test('should retrieve an activation using alt id parameter', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const activations = new Activations(client)
  const activation_id = 'random_id'

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/activations/${activation_id}`)
  }

  return activations.get({activation: activation_id})
})

test('should retrieve an activation logs', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const activations = new Activations(client)
  const activation_id = 'random_id'

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/activations/${activation_id}/logs`)
  }

  return activations.logs({id: activation_id})
})

test('should retrieve an activation result', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const activations = new Activations(client)
  const activation_id = 'random_id'

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/activations/${activation_id}/result`)
  }

  return activations.result({id: activation_id})
})

test('should throw when retrieving activation without id', t => {
  const activations = new Activations()
  return t.throws(() => { activations.get() }, /Missing mandatory/)
})

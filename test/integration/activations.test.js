'use strict'

const test = require('ava')
const Activations = require('../../lib/activations.js')
const Client = require('../../lib/client.js')

const API_KEY = process.env.OW_API_KEY
const API_URL = process.env.OW_API_URL
const NAMESPACE = process.env['__OW_NAMESPACE']

if (!API_KEY) {
  throw new Error('Missing OW_API_KEY environment parameter')
}

if (!API_URL) {
  throw new Error('Missing OW_API_URL environment parameter')
}

if (!NAMESPACE) {
  throw new Error('Missing __OW_NAMESPACE environment parameter')
}

test('list all activations', t => {
  const params = {api: API_URL, api_key: API_KEY, namespace: NAMESPACE}

  const activations = new Activations(new Client(params))
  return activations.list().then(result => {
    t.true(Array.isArray(result))
    result.forEach(r => t.is(r.namespace, NAMESPACE))
    t.pass()
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

test('retrieve individual activations', t => {
  const params = {api: API_URL, api_key: API_KEY, namespace: NAMESPACE}

  const activations = new Activations(new Client(params))
  return activations.list().then(result => {
    t.true(Array.isArray(result))
    return Promise.all(result.map(r => activations.get({activation: r.activationId})))
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

test('retrieve individual activation logs', t => {
  const params = {api: API_URL, api_key: API_KEY, namespace: NAMESPACE}

  const activations = new Activations(new Client(params))
  return activations.list().then(result => {
    t.true(Array.isArray(result))
    return Promise.all(result.map(r => activations.logs({activation: r.activationId})))
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

test('retrieve individual activation result', t => {
  const params = {api: API_URL, api_key: API_KEY, namespace: NAMESPACE}

  const activations = new Activations(new Client(params))
  return activations.list().then(result => {
    t.true(Array.isArray(result))
    return Promise.all(result.map(r => activations.result({activation: r.activationId})))
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

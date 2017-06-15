// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

'use strict'

const test = require('ava')
const Activations = require('../../lib/activations.js')
const Client = require('../../lib/client.js')

const envParams = ['API_KEY', 'API_HOST', 'NAMESPACE']

// check that mandatory configuration properties are available
envParams.forEach(key => {
  const param = `__OW_${key}`
  if (!process.env.hasOwnProperty(param)) {
    throw new Error(`Missing ${param} environment parameter`)
  }
})

const NAMESPACE = process.env.__OW_NAMESPACE

test('list all activations', t => {
  const activations = new Activations(new Client())
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
  const activations = new Activations(new Client())
  return activations.list().then(result => {
    t.true(Array.isArray(result))
    return Promise.all(result.map(r => activations.get({activation: r.activationId})))
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

test('retrieve individual activation logs', t => {
  const activations = new Activations(new Client())
  return activations.list().then(result => {
    t.true(Array.isArray(result))
    return Promise.all(result.map(r => activations.logs({activation: r.activationId})))
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

test('retrieve individual activation result', t => {
  const activations = new Activations(new Client())
  return activations.list().then(result => {
    t.true(Array.isArray(result))
    return Promise.all(result.map(r => activations.result({activation: r.activationId})))
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

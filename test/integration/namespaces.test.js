// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

'use strict'

const test = require('ava')
const Namespaces = require('../../lib/namespaces.js')
const Client = require('../../lib/client.js')
const Utils = require('./utils.js')
const options = Utils.autoOptions()

const envParams = ['API_KEY', 'API_HOST', 'NAMESPACE']

// check that mandatory configuration properties are available
envParams.forEach(key => {
  const param = `__OW_${key}`
  if (!process.env.hasOwnProperty(param)) {
    throw new Error(`Missing ${param} environment parameter`)
  }
})

const NAMESPACE = process.env.__OW_NAMESPACE

test('list all namespaces', t => {
  const namespaces = new Namespaces(new Client(options))
  return namespaces.list().then(result => {
    t.true(Array.isArray(result))
    t.pass()
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

test('retrieve individual namespaces', t => {
  const namespaces = new Namespaces(new Client(options))
  return namespaces.list().then(result => {
    t.true(Array.isArray(result))
    return Promise.all(result.map(ns => namespaces.get({namespace: ns})))
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

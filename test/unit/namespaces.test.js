// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

'use strict'

const test = require('ava')
const Namespaces = require('../../lib/namespaces')

test('should list all namespaces', t => {
  t.plan(2)
  const client = {}
  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces`)
  }

  const namespaces = new Namespaces(client)
  return namespaces.list()
})

test('should retrieve namespace entities', t => {
  t.plan(16)
  const client = {}
  client.request = (method, path, options) => {
    t.is(method, 'GET')
    let parts = path.split('/')
    t.is(parts[0], 'namespaces')
    t.is(parts[1], '_')
    t.is(['actions', 'triggers', 'rules', 'packages'].indexOf(parts[2]) > -1, true)
  }

  const namespaces = new Namespaces(client)
  return namespaces.get()
})

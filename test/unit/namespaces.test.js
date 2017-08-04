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

test('should retrieve namespace using id', t => {
  t.plan(2)
  const client = {}
  const id = 'custom_ns'
  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${id}`)
  }

  const namespaces = new Namespaces(client)
  return namespaces.get({name: id})
})

test('should retrieve namespace using string id', t => {
  t.plan(2)
  const client = {}
  const id = 'custom_ns'
  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${id}`)
  }

  const namespaces = new Namespaces(client)
  return namespaces.get(id)
})

test('should retrieve namespace using namespace', t => {
  t.plan(2)
  const client = {}
  const id = 'custom_ns'
  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${id}`)
  }

  const namespaces = new Namespaces(client)
  return namespaces.get({namespace: id})
})

test('should throw error for missing namespace id', t => {
  const namespaces = new Namespaces()
  return t.throws(() => {
    namespaces.get()
  }, /Missing mandatory parameter/)
})

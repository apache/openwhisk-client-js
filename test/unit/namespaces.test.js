// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

'use strict'

const test = require('ava')
const Client = require('../../lib/client')
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

test('should list all namespaces, passing through user-agent header', t => {
  t.plan(3)
  const client = {}
  const userAgent = 'userAgentShouldPassThroughPlease'
  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces`)
    t.is(options['User-Agent'], userAgent)
  }

  const namespaces = new Namespaces(client)
  return namespaces.list({'User-Agent': userAgent})
})

test('should list all namespaces, NOT passing through user-agent header (variant 1)', t => {
  t.plan(3)
  const client = {}
  const userAgent = 'userAgentShouldPassThroughPlease'
  client.request = async (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces`)

    const parms = await new Client({api: 'aaa', api_key: 'aaa'}).params(method, path, options)
    t.is(parms.headers['User-Agent'], undefined)
  }

  const namespaces = new Namespaces(client)
  return namespaces.list({'User-Agent': userAgent, noUserAgent: true})
})

test('should list all namespaces, NOT passing through user-agent header (variant 2)', t => {
  t.plan(3)
  const client = {}
  const userAgent = 'userAgentShouldPassThroughPlease'
  client.request = async (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces`)

    const parms = await new Client({api: 'aaa', api_key: 'aaa', noUserAgent: true}).params(method, path, options)
    t.is(parms.headers['User-Agent'], undefined)
  }

  const namespaces = new Namespaces(client)
  return namespaces.list({'User-Agent': userAgent})
})

test('should list all namespaces, NOT passing through user-agent header (variant 3)', t => {
  t.plan(3)
  const client = {}
  client.request = async (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces`)

    const parms = await new Client({api: 'aaa', api_key: 'aaa', noUserAgent: true}).params(method, path, options)
    t.is(parms.headers['User-Agent'], undefined)
  }

  const namespaces = new Namespaces(client)
  return namespaces.list({})
})

test('should list all namespaces, NOT passing through user-agent header (variant 4)', t => {
  t.plan(3)
  const client = {}
  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces`)
    t.is(options['User-Agent'], undefined)
  }

  const namespaces = new Namespaces(client)
  return namespaces.list({noUserAgent: true})
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

test('should retrieve namespace entities, passing through user-agent header', t => {
  t.plan(20)
  const client = {}
  const userAgent = 'userAgentShouldPassThroughPlease'
  client.request = (method, path, options) => {
    t.is(method, 'GET')
    let parts = path.split('/')
    t.is(parts[0], 'namespaces')
    t.is(parts[1], '_')
    t.is(['actions', 'triggers', 'rules', 'packages'].indexOf(parts[2]) > -1, true)
    t.is(options['User-Agent'], userAgent)
  }

  const namespaces = new Namespaces(client)
  return namespaces.get({'User-Agent': userAgent})
})

/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
  return namespaces.list({ 'User-Agent': userAgent })
})

test('should list all namespaces, NOT passing through user-agent header (variant 1)', t => {
  t.plan(3)
  const client = {}
  const userAgent = 'userAgentShouldPassThroughPlease'
  client.request = async (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces`)

    const parms = await new Client({ api: 'aaa', api_key: 'aaa' }).params(method, path, options)
    t.is(parms.headers['User-Agent'], undefined)
  }

  const namespaces = new Namespaces(client)
  return namespaces.list({ 'User-Agent': userAgent, noUserAgent: true })
})

test('should list all namespaces, NOT passing through user-agent header (variant 2)', t => {
  t.plan(3)
  const client = {}
  const userAgent = 'userAgentShouldPassThroughPlease'
  client.request = async (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces`)

    const parms = await new Client({ api: 'aaa', api_key: 'aaa', noUserAgent: true }).params(method, path, options)
    t.is(parms.headers['User-Agent'], undefined)
  }

  const namespaces = new Namespaces(client)
  return namespaces.list({ 'User-Agent': userAgent })
})

test('should list all namespaces, NOT passing through user-agent header (variant 3)', t => {
  t.plan(3)
  const client = {}
  client.request = async (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces`)

    const parms = await new Client({ api: 'aaa', api_key: 'aaa', noUserAgent: true }).params(method, path, options)
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
  return namespaces.list({ noUserAgent: true })
})

test('should list all namespaces, using __OW_USER_AGENT', t => {
  t.plan(3)
  const client = {}
  process.env['__OW_USER_AGENT'] = 'my-useragent'
  client.request = async (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces`)

    const parms = await new Client({ api: 'aaa', api_key: 'aaa' }).params(method, path, options)
    t.is(parms.headers['User-Agent'], 'my-useragent')
    delete process.env['__OW_USER_AGENT']
  }

  const namespaces = new Namespaces(client)
  return namespaces.list({})
})

test('should list all namespaces, NOT using __OW_USER_AGENT when noUserAgent true', t => {
  t.plan(3)
  const client = {}
  process.env['__OW_USER_AGENT'] = 'my-useragent'
  client.request = async (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces`)

    const parms = await new Client({ api: 'aaa', api_key: 'aaa', noUserAgent: true }).params(method, path, options)
    t.is(parms.headers['User-Agent'], undefined)
    delete process.env['__OW_USER_AGENT']
  }

  const namespaces = new Namespaces(client)
  return namespaces.list({})
})

test('should list all namespaces, NOT using __OW_USER_AGENT when user-agent is passed through', t => {
  t.plan(3)
  const client = {}
  const userAgent = 'userAgentShouldPassThroughPlease'
  process.env['__OW_USER_AGENT'] = 'my-useragent'
  client.request = async (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces`)

    const parms = await new Client({ api: 'aaa', api_key: 'aaa' }).params(method, path, options)
    t.is(parms.headers['User-Agent'], userAgent)
    delete process.env['__OW_USER_AGENT']
  }

  const namespaces = new Namespaces(client)
  return namespaces.list({ 'User-Agent': userAgent })
})

test('should list all namespaces, NOT using __OW_USER_AGENT or user-agent when noUserAgent is true', t => {
  t.plan(3)
  const client = {}
  const userAgent = 'userAgentShouldPassThroughPlease'
  process.env['__OW_USER_AGENT'] = 'my-useragent'
  client.request = async (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces`)

    const parms = await new Client({ api: 'aaa', api_key: 'aaa', noUserAgent: true }).params(method, path, options)
    t.is(parms.headers['User-Agent'], undefined)
    delete process.env['__OW_USER_AGENT']
  }

  const namespaces = new Namespaces(client)
  return namespaces.list({ 'User-Agent': userAgent })
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
  return namespaces.get({ 'User-Agent': userAgent })
})

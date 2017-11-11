// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

'use strict'

const test = require('ava')
const BaseOperation = require('../../lib/base_operation')

test('should invoke client request for resource', t => {
  t.plan(2)
  const namespace = '_'
  const resource = 'resource_id'
  const method = 'GET'
  const client = {
    request: (_method, _path) => {
      t.is(_method, method)
      t.is(_path, `namespaces/${namespace}/${resource}`)
    }
  }

  const baseOperation = new BaseOperation(client)
  baseOperation.resource = resource
  baseOperation.request({method})
})

test('should invoke client request for resource with identifier', t => {
  t.plan(2)
  const namespace = '_'
  const resource = 'resource_id'
  const method = 'GET'
  const id = '12345'
  const client = {
    request: (_method, _path) => {
      t.is(_method, method)
      t.is(_path, `namespaces/${namespace}/${resource}/${id}`)
    }
  }

  const baseOperation = new BaseOperation(client)
  baseOperation.resource = resource
  baseOperation.request({method, id})
})

test('should invoke client request with user parameters', t => {
  t.plan(3)
  const namespace = '_'
  const resource = 'resource_id'
  const method = 'GET'
  const id = '12345'
  const options = {qs: {hello: 'world'}, body: {hello: 'world'}}
  const client = {
    request: (_method, _path, _options) => {
      t.is(_method, method)
      t.is(_path, `namespaces/${namespace}/${resource}/${id}`)
      t.deepEqual(_options, {qs: {hello: 'world'}, body: {hello: 'world'}})
    }
  }

  const baseOperation = new BaseOperation(client)
  baseOperation.resource = resource
  baseOperation.request({method, id, options})
})

test('should extract available query string parameters', t => {
  const baseOperation = new BaseOperation()
  t.deepEqual(baseOperation.qs({}, ['a', 'b', 'c']), {})
  t.deepEqual(baseOperation.qs({a: 1}, ['a', 'b', 'c']), {a: 1})
  t.deepEqual(baseOperation.qs({a: 1, c: 2}, ['a', 'b', 'c']), {a: 1, c: 2})
  t.deepEqual(baseOperation.qs({a: 1, c: 2, d: 3}, ['a', 'b', 'c']), {a: 1, c: 2})
})

test('should return appropriate namespace', t => {
  let baseOperation = new BaseOperation()
  t.is(baseOperation.namespace({namespace: 'provided'}), 'provided')

  // using global ns
  baseOperation = new BaseOperation({options: {namespace: 'global_ns'}})
  t.is(baseOperation.namespace({namespace: 'provided'}), 'provided')
  baseOperation = new BaseOperation({options: {namespace: 'global_ns'}})
  t.is(baseOperation.namespace({}), 'global_ns')
  t.is(baseOperation.namespace(), 'global_ns')

  baseOperation = new BaseOperation('default')
  t.is(baseOperation.namespace({namespace: 'provided'}), 'provided')
  t.is(baseOperation.namespace(), '_')
})

test('should url encode namespace parameter', t => {
  let baseOperation = new BaseOperation('sample@path')
  t.is(baseOperation.namespace({namespace: 'sample path'}), `sample%20path`)
  t.is(baseOperation.namespace({namespace: 'sample@path'}), `sample%40path`)
})

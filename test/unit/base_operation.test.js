'use strict'

const test = require('ava')
const BaseOperation = require('../../lib/base_operation')

test('should invoke client request for resource', t => {
  t.plan(2)
  const namespace = '_'
  const resource = 'resource_id'
  const method = 'GET'
  const client = {request: (_method, _path) => {
    t.is(_method, method)
    t.is(_path, `namespaces/${namespace}/${resource}`)
  }}

  const base_operation = new BaseOperation(client)
  base_operation.resource = resource
  base_operation.request({method})
})

test('should invoke client request for resource with identifier', t => {
  t.plan(2)
  const namespace = '_'
  const resource = 'resource_id'
  const method = 'GET'
  const id = '12345'
  const client = {request: (_method, _path) => {
    t.is(_method, method)
    t.is(_path, `namespaces/${namespace}/${resource}/${id}`)
  }}

  const base_operation = new BaseOperation(client)
  base_operation.resource = resource
  base_operation.request({method, id})
})

test('should invoke client request with user parameters', t => {
  t.plan(3)
  const namespace = '_'
  const resource = 'resource_id'
  const method = 'GET'
  const id = '12345'
  const options = {qs: {hello: 'world'}, body: {hello: 'world'}}
  const client = {request: (_method, _path, _options) => {
    t.is(_method, method)
    t.is(_path, `namespaces/${namespace}/${resource}/${id}`)
    t.deepEqual(_options, {qs: {hello: 'world'}, body: {hello: 'world'}})
  }}

  const base_operation = new BaseOperation(client)
  base_operation.resource = resource
  base_operation.request({method, id, options})
})

test('should extract available query string parameters', t => {
  const base_operation = new BaseOperation()
  t.deepEqual(base_operation.qs({}, ['a', 'b', 'c']), {})
  t.deepEqual(base_operation.qs({a: 1}, ['a', 'b', 'c']), {a: 1})
  t.deepEqual(base_operation.qs({a: 1, c: 2}, ['a', 'b', 'c']), {a: 1, c: 2})
  t.deepEqual(base_operation.qs({a: 1, c: 2, d: 3}, ['a', 'b', 'c']), {a: 1, c: 2})
})

test('should return appropriate namespace', t => {
  let base_operation = new BaseOperation()
  t.is(base_operation.namespace({namespace: 'provided'}), 'provided')

  // using global ns
  base_operation = new BaseOperation({ options: { namespace: 'global_ns' }})
  t.is(base_operation.namespace({namespace: 'provided'}), 'provided')
  base_operation = new BaseOperation({ options: { namespace: 'global_ns' }})
  t.is(base_operation.namespace({}), 'global_ns')
  t.is(base_operation.namespace(), 'global_ns')

  base_operation = new BaseOperation('default')
  t.is(base_operation.namespace({namespace: 'provided'}), 'provided')
  t.is(base_operation.namespace(), '_')
})

test('should url encode namespace parameter', t => {
  let base_operation = new BaseOperation('sample@path')
  t.is(base_operation.namespace({namespace: 'sample path'}), `sample%20path`)
  t.is(base_operation.namespace({namespace: 'sample@path'}), `sample%40path`)
})

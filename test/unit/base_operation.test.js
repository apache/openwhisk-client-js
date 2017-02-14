'use strict'

const test = require('ava')
const BaseOperation = require('../../lib/base_operation')

test('should invoke client request for resource', t => {
  t.plan(2)
  const namespace = 'user_ns'
  const resource = 'resource_id'
  const method = 'GET'
  const client = {request:  (_method, _path) => {
    t.is(_method, method)
    t.is(_path, `namespace/${namespace}/${resource}`)
  }}

  const base_operation = new BaseOperation(namespace, client)
  base_operation.resource = resource
  base_operation.request({method})
})

test('should invoke client request for resource with identifier', t => {
  t.plan(2)
  const namespace = 'user_ns'
  const resource = 'resource_id'
  const method = 'GET'
  const id = '12345'
  const client = {request:  (_method, _path) => {
    t.is(_method, method)
    t.is(_path, `namespace/${namespace}/${resource}/${id}`)
  }}

  const base_operation = new BaseOperation(namespace, client)
  base_operation.resource = resource
  base_operation.request({method, id})
})

test('should invoke client request with user parameters', t => {
  t.plan(3)
  const namespace = 'user_ns'
  const resource = 'resource_id'
  const method = 'GET'
  const id = '12345'
  const options = {qs: {hello: 'world'}, body: {hello: 'world'}}
  const client = {request:  (_method, _path, _options) => {
    t.is(_method, method)
    t.is(_path, `namespace/${namespace}/${resource}/${id}`)
    t.deepEqual(_options, {qs: {hello: 'world'}, body: {hello: 'world'}})
  }}

  const base_operation = new BaseOperation(namespace, client)
  base_operation.resource = resource
  base_operation.request({method, id, options})
})

test('should generate list resource request', t => {
  t.plan(1)
  let params = null
  const base_operation = new BaseOperation('')
  base_operation.request = options => {
    t.deepEqual(options, {method: 'GET', options: {}})
  }

  base_operation.list()
  //t.deepEqual(params, {method: 'GET', path: `namespace/${NAMESPACE}/${RESOURCE}`})
})

/**
test('should generate resource request with query parameters', t => {
  const NAMESPACE = 'user_ns'
  const RESOURCE = 'resource_id'
  const PARAMS = {skip: 100, limit: 10}
  let params = null
  const client = { request: p => params = p }
  const base_operation = new BaseOperation(NAMESPACE, client)
  base_operation.resource = RESOURCE

  base_operation.list(PARAMS)
  t.deepEqual(params, {method: 'GET', path: `namespace/${NAMESPACE}/${RESOURCE}`, qs: PARAMS})
})

*/

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
  base_operation = new BaseOperation('default')
  t.is(base_operation.namespace({namespace: 'provided'}), 'provided')
  t.is(base_operation.namespace(), 'default')
})

test('should url encode namespace parameter', t => {
  let base_operation = new BaseOperation('sample@path')
  t.is(base_operation.namespace(), `sample%40path`)
  t.is(base_operation.namespace({namespace: 'sample path'}), `sample%20path`)
})

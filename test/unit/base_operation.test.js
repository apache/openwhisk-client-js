'use strict'

const test = require('ava')
const BaseOperation = require('../../lib/base_operation')

test('should throw errors for HTTP response failures', t => {
  const base_operation = new BaseOperation()
  t.throws(() => base_operation.handle_errors({statusCode: 401}), /authentication failed/)
  t.throws(() => base_operation.handle_errors({statusCode: 403}), /authentication failed/)
  t.throws(() => base_operation.handle_errors({statusCode: 404}), /HTTP 404/)
  t.throws(() => base_operation.handle_errors({statusCode: 408}), /timed out/)
  t.throws(() => base_operation.handle_errors({statusCode: 409}), /action already exists/i)
  t.throws(() => base_operation.handle_errors({statusCode: 500, error: {}}), /API call failed/)
  t.throws(() => base_operation.handle_errors({statusCode: 500, error: {response: {result: {error: 'custom'}}}}), /custom/)
})

test('should throw errors for non-HTTP response failures', t => {
  const base_operation = new BaseOperation()
  t.throws(() => base_operation.handle_errors({message: 'error message'}), /error message/)
})

test('should generate auth header from API key', t => {
  const api_key = 'some sample api key'
  const base_operation = new BaseOperation({api_key: api_key})
  t.is(base_operation.auth_header(), `Basic ${new Buffer(api_key).toString('base64')}`)
})

test('should extract available query string parameters', t => {
  const base_operation = new BaseOperation()
  t.deepEqual(base_operation.qs({}, ['a', 'b', 'c']), {})
  t.deepEqual(base_operation.qs({a: 1}, ['a', 'b', 'c']), {a: 1})
  t.deepEqual(base_operation.qs({a: 1, c: 2}, ['a', 'b', 'c']), {a: 1, c: 2})
  t.deepEqual(base_operation.qs({a: 1, c: 2, d: 3}, ['a', 'b', 'c']), {a: 1, c: 2})
})

test('should return provided namespace', t => {
  let base_operation = new BaseOperation()
  t.is(base_operation.namespace({namespace: 'provided'}), 'provided')
  base_operation = new BaseOperation({namespace: 'default'})
  t.is(base_operation.namespace({namespace: 'provided'}), 'provided')
})

test('should return default namespace', t => {
  const base_operation = new BaseOperation({namespace: 'default'})
  t.is(base_operation.namespace(), 'default')
})

test('should throw for missing namespace', t => {
  const base_operation = new BaseOperation({})
  t.throws(() => base_operation.namespace({}), /Missing namespace/)
})

test('should return request parameters from path', t => {
  const base_operation = new BaseOperation({api: 'https://api.com/api/v1/', api_key: 'default'})
  const params = base_operation.params('method', 'some/path')
  t.is(params.url, 'https://api.com/api/v1/some/path')
  t.is(params.method, 'method')
  t.true(params.json, true)
  t.true(params.headers.hasOwnProperty('Authorization'))
})

test('should return request parameters from path without ending forward slash', t => {
  const base_operation = new BaseOperation({api: 'https://api.com/api/v1', api_key: 'default'})
  const params = base_operation.params('method', 'some/path')
  t.is(params.url, 'https://api.com/api/v1/some/path')
  t.is(params.method, 'method')
  t.true(params.json, true)
  t.true(params.headers.hasOwnProperty('Authorization'))
})

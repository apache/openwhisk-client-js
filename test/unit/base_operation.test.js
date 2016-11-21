'use strict'

const test = require('ava')
const BaseOperation = require('../../lib/base_operation')

test('should throw errors for HTTP response failures', t => {
  const base_operation = new BaseOperation({api_key: true, api: true})
  t.throws(() => base_operation.handle_errors({statusCode: 401}), /authentication failed/)
  t.throws(() => base_operation.handle_errors({statusCode: 403}), /authentication failed/)
  t.throws(() => base_operation.handle_errors({statusCode: 404}), /HTTP 404/)
  t.throws(() => base_operation.handle_errors({statusCode: 408}), /timed out/)
  t.throws(() => base_operation.handle_errors({statusCode: 409}), /Conflict/)
  t.throws(() => base_operation.handle_errors({statusCode: 500, error: {}}), /API call failed/)
  t.throws(() => base_operation.handle_errors({statusCode: 500, error: {response: {result: {error: 'custom'}}}}), /custom/)
})

test('should throw error when missing API key option.', t => {
  t.throws(() => new BaseOperation({api: true}), /Missing api_key parameter./)
})

test('should throw error when missing both API and API Host options.', t => {
  t.throws(() => new BaseOperation({api_key: true}), /Missing either api or apihost parameters/)
})

test('should set options.api from options.apihost with hostname only', t => {
  const base_operation = new BaseOperation({api_key: true, apihost: 'my_host'})
  t.true(base_operation.options.hasOwnProperty('api'))
  t.is(base_operation.options.api, 'https://my_host/api/v1/')
})

test('should set options.api from options.apihost with hostname and https port', t => {
  const base_operation = new BaseOperation({api_key: true, apihost: 'my_host:443'})
  t.true(base_operation.options.hasOwnProperty('api'))
  t.is(base_operation.options.api, 'https://my_host:443/api/v1/')
})

test('should set options.api from options.apihost with hostname and https port', t => {
  const base_operation = new BaseOperation({api_key: true, apihost: 'my_host:80'})
  t.true(base_operation.options.hasOwnProperty('api'))
  t.is(base_operation.options.api, 'http://my_host:80/api/v1/')
})

test('should throw errors for non-HTTP response failures', t => {
  const base_operation = new BaseOperation({api_key: true, api: true})
  t.throws(() => base_operation.handle_errors({message: 'error message'}), /error message/)
})

test('should use environment parameters for options if not set explicitly.', t => {
  process.env['__OW_APIKEY'] = 'some_user:some_pass'
  process.env['__OW_APIHOST'] = 'mywhiskhost'
  process.env['__OW_NAMESPACE'] = 'user@host.com'
  const base_operation = new BaseOperation()
  t.is(base_operation.options.api_key, process.env['__OW_APIKEY'])
  t.is(base_operation.options.api, 'https://mywhiskhost/api/v1/')
  t.is(base_operation.options.namespace, process.env['__OW_NAMESPACE'])
  delete process.env['__OW_APIKEY']
  delete process.env['__OW_APIHOST']
  delete process.env['__OW_NAMESPACE']
})

test('should use options for parameters even if environment parameters are available.', t => {
  process.env['__OW_APIKEY'] = 'some_user:some_pass'
  process.env['__OW_APIHOST'] = 'mywhiskhost'
  process.env['__OW_NAMESPACE'] = 'user@host.com'
  const base_operation = new BaseOperation({apihost: 'openwhisk', api_key: 'mykey', namespace: 'mynamespace'})
  t.is(base_operation.options.api_key, 'mykey')
  t.is(base_operation.options.api, 'https://openwhisk/api/v1/')
  t.is(base_operation.options.namespace, 'mynamespace')
  delete process.env['__OW_APIKEY']
  delete process.env['__OW_APIHOST']
  delete process.env['__OW_NAMESPACE']
})

test('should generate auth header from API key', t => {
  const api_key = 'some sample api key'
  const base_operation = new BaseOperation({api: true, api_key: api_key})
  t.is(base_operation.auth_header(), `Basic ${new Buffer(api_key).toString('base64')}`)
})

test('should extract available query string parameters', t => {
  const base_operation = new BaseOperation({api_key: true, api: true})
  t.deepEqual(base_operation.qs({}, ['a', 'b', 'c']), {})
  t.deepEqual(base_operation.qs({a: 1}, ['a', 'b', 'c']), {a: 1})
  t.deepEqual(base_operation.qs({a: 1, c: 2}, ['a', 'b', 'c']), {a: 1, c: 2})
  t.deepEqual(base_operation.qs({a: 1, c: 2, d: 3}, ['a', 'b', 'c']), {a: 1, c: 2})
})

test('should return provided namespace', t => {
  let base_operation = new BaseOperation({api_key: true, api: true})
  t.is(base_operation.namespace({namespace: 'provided'}), 'provided')
  base_operation = new BaseOperation({api_key: true, api: true, namespace: 'default'})
  t.is(base_operation.namespace({namespace: 'provided'}), 'provided')
})

test('should return default namespace', t => {
  const base_operation = new BaseOperation({api_key: true, api: true, namespace: 'default'})
  t.is(base_operation.namespace(), 'default')
})

test('should throw for missing namespace', t => {
  const base_operation = new BaseOperation({api_key: true, api: true})
  t.throws(() => base_operation.namespace({}), /Missing namespace/)
  t.throws(() => base_operation.namespace({namespace: null}), /Missing namespace/)
  t.throws(() => base_operation.namespace({namespace: undefined}), /Missing namespace/)
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

test('should url encode namespace parameter', t => {
  const options = {api_key: true, api: true, namespace: 'sample@path'}
  let base_operation = new BaseOperation(options)

  t.is(base_operation.namespace(), `sample%40path`)
  t.is(base_operation.namespace({namespace: 'sample path'}), `sample%20path`)
})

'use strict'

const test = require('ava')
const Client = require('../../lib/client')

test('should use default constructor options', t => {
  const client = new Client({api_key: 'aaa', apihost: 'my_host'})
  t.false(client.options.ignore_certs)
  t.is(client.options.api_key, 'aaa')
  t.is(client.options.api, 'https://my_host/api/v1/')
  t.falsy(client.options.namespace)
})

test('should support explicit constructor options', t => {
  const client = new Client({namespace: 'ns', ignore_certs: true, api_key: 'aaa', api: 'my_host'})
  t.is(client.options.api, 'my_host')
  t.true(client.options.ignore_certs)
  t.is(client.options.namespace, 'ns')
})

test('should use environment parameters for options if not set explicitly.', t => {
  process.env['__OW_API_KEY'] = 'some_user:some_pass'
  process.env['__OW_API_HOST'] = 'mywhiskhost'
  const client = new Client()
  t.is(client.options.api_key, process.env['__OW_API_KEY'])
  t.is(client.options.api, 'https://mywhiskhost/api/v1/')
  delete process.env['__OW_API_KEY']
  delete process.env['__OW_API_HOST']
})

test('should use options for parameters even if environment parameters are available.', t => {
  process.env['__OW_API_KEY'] = 'some_user:some_pass'
  process.env['__OW_API_HOST'] = 'mywhiskhost'
  const client = new Client({apihost: 'openwhisk', api_key: 'mykey'})
  t.is(client.options.api_key, 'mykey')
  t.is(client.options.api, 'https://openwhisk/api/v1/')
  delete process.env['__OW_API_KEY']
  delete process.env['__OW_API_HOST']
})

test('should throw error when missing API key option.', t => {
  t.throws(() => new Client({api: true}), /Missing api_key parameter./)
})

test('should throw error when missing both API and API Host options.', t => {
  t.throws(() => new Client({api_key: true}), /Missing either api or apihost parameters/)
})

test('should handle multiple api parameter formats', t => {
  const client = new Client({api_key: true, apihost: 'blah'})
  t.is(client.url_from_apihost('my_host'), 'https://my_host/api/v1/')
  t.is(client.url_from_apihost('https://my_host:80'), 'https://my_host:80/api/v1/')
  t.is(client.url_from_apihost('http://my_host:80'), 'http://my_host:80/api/v1/')
})

test('should return default request parameters without options', t => {
  const client = new Client({api_key: 'username:password', apihost: 'blah'})
  const METHOD = 'get'
  const PATH = 'some/path/to/resource'

  const params = client.params(METHOD, PATH)
  t.is(params.url, 'https://blah/api/v1/some/path/to/resource')
  t.is(params.method, METHOD)
  t.true(params.json)
  t.true(params.rejectUnauthorized)
  t.true(params.headers.hasOwnProperty('Authorization'))
})

test('should return request parameters with merged options', t => {
  const client = new Client({api_key: 'username:password', apihost: 'blah'})
  const METHOD = 'get'
  const PATH = 'some/path/to/resource'
  const OPTIONS = {b: {bar: 'foo'}, a: {foo: 'bar'}}

  const params = client.params(METHOD, PATH, OPTIONS)
  t.is(params.url, 'https://blah/api/v1/some/path/to/resource')
  t.is(params.method, METHOD)
  t.true(params.json)
  t.true(params.rejectUnauthorized)
  t.true(params.headers.hasOwnProperty('Authorization'))
  t.deepEqual(params.a, {foo: 'bar'})
  t.deepEqual(params.b, {bar: 'foo'})
})

test('should return request parameters with explicit api option', t => {
  const client = new Client({api_key: 'username:password', api: 'https://api.com/api/v1'})
  const METHOD = 'get'
  const PATH = 'some/path/to/resource'

  t.is(client.params(METHOD, PATH).url, 'https://api.com/api/v1/some/path/to/resource')
  client.options.api += '/'
  t.is(client.params(METHOD, PATH).url, 'https://api.com/api/v1/some/path/to/resource')
})

test('should generate auth header from API key', t => {
  const api_key = 'some sample api key'
  const client = new Client({api: true, api_key: api_key})
  t.is(client.auth_header(), `Basic ${Buffer.from(api_key).toString('base64')}`)
})

test('should throw errors for HTTP response failures', t => {
  const client = new Client({api_key: true, api: true})
  t.throws(() => client.handle_errors({statusCode: 400}), /invalid request/)
  t.throws(() => client.handle_errors({statusCode: 400, error: { error: 'some msg'}}), /some msg/)
  t.throws(() => client.handle_errors({statusCode: 401}), /authentication failed/)
  t.throws(() => client.handle_errors({statusCode: 403}), /authentication failed/)
  t.throws(() => client.handle_errors({statusCode: 404}), /HTTP 404/)
  t.throws(() => client.handle_errors({statusCode: 408}), /timed out/)
  t.throws(() => client.handle_errors({statusCode: 409}), /Conflict/)
  t.throws(() => client.handle_errors({statusCode: 500, error: {}}), /API call failed/)
  t.throws(() => client.handle_errors({statusCode: 500, error: {response: {result: {error: 'custom'}}}}), /custom/)
  t.throws(() => client.handle_errors({statusCode: 502, error: {}}), /Action invocation failed/)
  t.throws(() => client.handle_errors({statusCode: 500, error: {response: {result: {error: 'custom'}}}}), /custom/)
})

test('should throw errors for non-HTTP response failures', t => {
  const client = new Client({api_key: true, api: true})
  t.throws(() => client.handle_errors({message: 'error message'}), /error message/)
})

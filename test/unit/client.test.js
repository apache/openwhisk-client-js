// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

'use strict'

const test = require('ava')
const Client = require('../../lib/client')
const http = require('http')

test('should use default constructor options', t => {
  const client = new Client({api_key: 'aaa', apihost: 'my_host'})
  t.false(client.options.ignore_certs)
  t.is(client.options.api_key, 'aaa')
  t.is(client.options.api, 'https://my_host/api/v1/')
  t.falsy(client.options.namespace)
})

test('should support explicit constructor options', t => {
  const client = new Client({namespace: 'ns', ignore_certs: true, api_key: 'aaa', api: 'my_host', apigw_token: 'oauth_token', apigw_space_guid: 'space_guid'})
  t.is(client.options.api, 'my_host')
  t.true(client.options.ignore_certs)
  t.is(client.options.namespace, 'ns')
  t.is(client.options.apigw_token, 'oauth_token')
  t.is(client.options.apigw_space_guid, 'space_guid')
})

test('should use uuid from auth key as space guid if apigw_token present', t => {
  const client = new Client({namespace: 'ns', ignore_certs: true, api_key: 'uuid:pass', api: 'my_host', apigw_token: 'oauth_token'})
  t.is(client.options.apigw_space_guid, 'uuid')
})

test('should use environment parameters for options if not set explicitly.', t => {
  process.env['__OW_API_KEY'] = 'some_user:some_pass'
  process.env['__OW_API_HOST'] = 'mywhiskhost'
  process.env['__OW_APIGW_TOKEN'] = 'my-token'
  process.env['__OW_APIGW_SPACE_GUID'] = 'my-space'
  const client = new Client()
  t.is(client.options.api_key, process.env['__OW_API_KEY'])
  t.is(client.options.api, 'https://mywhiskhost/api/v1/')
  t.is(client.options.apigw_token, 'my-token')
  t.is(client.options.apigw_space_guid, 'my-space')
  delete process.env['__OW_API_KEY']
  delete process.env['__OW_API_HOST']
  delete process.env['__OW_APIGW_TOKEN']
  delete process.env['__OW_APIGW_SPACE_GUID']
})

test('should use options for parameters even if environment parameters are available.', t => {
  process.env['__OW_API_KEY'] = 'some_user:some_pass'
  process.env['__OW_API_HOST'] = 'mywhiskhost'
  process.env['__OW_APIGW_TOKEN'] = 'my-token'
  process.env['__OW_APIGW_SPACE_GUID'] = 'my-space'
  const client = new Client({apihost: 'openwhisk', api_key: 'mykey', apigw_token: 'token', apigw_space_guid: 'guid'})
  t.is(client.options.api_key, 'mykey')
  t.is(client.options.api, 'https://openwhisk/api/v1/')
  t.is(client.options.apigw_token, 'token')
  t.is(client.options.apigw_space_guid, 'guid')
  delete process.env['__OW_API_KEY']
  delete process.env['__OW_API_HOST']
  delete process.env['__OW_APIGW_TOKEN']
  delete process.env['__OW_APIGW_SPACE_GUID']
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

test('should return path and status code in error message', t => {
  const client = new Client({api_key: true, api: true})
  const method = 'METHOD', url = 'https://blah.com/api/v1/actions/list', statusCode = 400
  t.throws(() => client.handle_errors({options: { method, url }, statusCode }), `${method} ${url} Returned HTTP ${statusCode} (${http.STATUS_CODES[statusCode]}) --> "Response Missing Error Message."`)
})

test('should return response error string in error message', t => {
  const client = new Client({api_key: true, api: true})
  const method = 'METHOD', url = 'https://blah.com/api/v1/actions/list', statusCode = 400
  t.throws(() => client.handle_errors({error: { error: 'hello' }, options: { method, url }, statusCode }), `${method} ${url} Returned HTTP ${statusCode} (${http.STATUS_CODES[statusCode]}) --> "hello"`)
  t.throws(() => client.handle_errors({error: { response: { result: { error: 'hello' } } }, options: { method, url }, statusCode }), `${method} ${url} Returned HTTP ${statusCode} (${http.STATUS_CODES[statusCode]}) --> "hello"`)
  t.throws(() => client.handle_errors({error: { response: { result: { error: { error: 'hello' } } } }, options: { method, url }, statusCode }), `${method} ${url} Returned HTTP ${statusCode} (${http.STATUS_CODES[statusCode]}) --> "hello"`)
  t.throws(() => client.handle_errors({error: { response: { result: { error: { statusCode: 404 } } } }, options: { method, url }, statusCode }), `${method} ${url} Returned HTTP ${statusCode} (${http.STATUS_CODES[statusCode]}) --> "application error, status code: ${404}"`)
})

test('should throw errors for non-HTTP response failures', t => {
  const client = new Client({api_key: true, api: true})
  t.throws(() => client.handle_errors({message: 'error message'}), /error message/)
})

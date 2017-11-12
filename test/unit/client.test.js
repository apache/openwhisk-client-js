// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

'use strict'

const test = require('ava')
const Client = require('../../lib/client')
const http = require('http')

test('should use default constructor options', t => {
  const client = new Client({apiKey: 'aaa', apihost: 'my_host'})
  t.false(client.options.ignoreCerts)
  t.is(client.options.apiKey, 'aaa')
  t.is(client.options.api, 'https://my_host/api/v1/')
  t.falsy(client.options.namespace)
})

test('should support explicit constructor options', t => {
  const client = new Client({
    namespace: 'ns',
    ignoreCerts: true,
    apiKey: 'aaa',
    api: 'my_host',
    apigwToken: 'oauth_token',
    apigwSpaceGuid: 'space_guid'
  })
  t.is(client.options.api, 'my_host')
  t.true(client.options.ignoreCerts)
  t.is(client.options.namespace, 'ns')
  t.is(client.options.apigwToken, 'oauth_token')
  t.is(client.options.apigwSpaceGuid, 'space_guid')
})

test('should support deprecated explicit constructor options', t => {
  const client = new Client({
    namespace: 'ns',
    ignore_certs: true,
    api_key: 'aaa',
    api: 'my_host',
    apigw_token: 'oauth_token',
    apigw_space_guid: 'space_guid'
  })
  t.is(client.options.api, 'my_host')
  t.true(client.options.ignoreCerts)
  t.is(client.options.namespace, 'ns')
  t.is(client.options.apigwToken, 'oauth_token')
  t.is(client.options.apigwSpaceGuid, 'space_guid')
})

test('should use uuid from auth key as space guid if apigwToken present', t => {
  const client = new Client({
    namespace: 'ns',
    ignoreCerts: true,
    apiKey: 'uuid:pass',
    api: 'my_host',
    apigwToken: 'oauth_token'
  })
  t.is(client.options.apigwSpaceGuid, 'uuid')
})

test('should use environment parameters for options if not set explicitly.', t => {
  process.env['__OW_API_KEY'] = 'some_user:some_pass'
  process.env['__OW_API_HOST'] = 'mywhiskhost'
  process.env['__OW_APIGW_TOKEN'] = 'my-token'
  process.env['__OW_APIGW_SPACE_GUID'] = 'my-space'
  const client = new Client()
  t.is(client.options.apiKey, process.env['__OW_API_KEY'])
  t.is(client.options.api, 'https://mywhiskhost/api/v1/')
  t.is(client.options.apigwToken, 'my-token')
  t.is(client.options.apigwSpaceGuid, 'my-space')
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
  const client = new Client({apihost: 'openwhisk', apiKey: 'mykey', apigwToken: 'token', apigwSpaceGuid: 'guid'})
  t.is(client.options.apiKey, 'mykey')
  t.is(client.options.api, 'https://openwhisk/api/v1/')
  t.is(client.options.apigwToken, 'token')
  t.is(client.options.apigwSpaceGuid, 'guid')
  delete process.env['__OW_API_KEY']
  delete process.env['__OW_API_HOST']
  delete process.env['__OW_APIGW_TOKEN']
  delete process.env['__OW_APIGW_SPACE_GUID']
})

test('should throw error when missing API key option.', t => {
  t.throws(() => new Client({api: true}), /Missing apiKey parameter./)
})

test('should throw error when missing both API and API Host options.', t => {
  t.throws(() => new Client({apiKey: true}), /Missing either api or apihost parameters/)
})

test('should handle multiple api parameter formats', t => {
  const client = new Client({apiKey: true, apihost: 'blah'})
  t.is(client.urlFromApihost('my_host'), 'https://my_host/api/v1/')
  t.is(client.urlFromApihost('https://my_host:80'), 'https://my_host:80/api/v1/')
  t.is(client.urlFromApihost('http://my_host:80'), 'http://my_host:80/api/v1/')
})

test('should return default request parameters without options', t => {
  const client = new Client({apiKey: 'username:password', apihost: 'blah'})
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
  const client = new Client({apiKey: 'username:password', apihost: 'blah'})
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
  const client = new Client({apiKey: 'username:password', api: 'https://api.com/api/v1'})
  const METHOD = 'get'
  const PATH = 'some/path/to/resource'

  t.is(client.params(METHOD, PATH).url, 'https://api.com/api/v1/some/path/to/resource')
  client.options.api += '/'
  t.is(client.params(METHOD, PATH).url, 'https://api.com/api/v1/some/path/to/resource')
})

test('should generate auth header from API key', t => {
  const apiKey = 'some sample api key'
  const client = new Client({api: true, apiKey: apiKey})
  t.is(client.authHeader(), `Basic ${Buffer.from(apiKey).toString('base64')}`)
})

test('should return path and status code in error message', t => {
  const client = new Client({apiKey: true, api: true})
  const method = 'METHOD'
  const url = 'https://blah.com/api/v1/actions/list'
  const statusCode = 400
  t.throws(() => client.handleErrors({
    options: {method, url},
    statusCode
  }), `${method} ${url} Returned HTTP ${statusCode} (${http.STATUS_CODES[statusCode]}) --> "Response Missing Error Message."`)
})

test('should return response error string in error message', t => {
  const client = new Client({apiKey: true, api: true})
  const method = 'METHOD'
  const url = 'https://blah.com/api/v1/actions/list'
  const statusCode = 400
  t.throws(() => client.handleErrors({
    error: {error: 'hello'},
    options: {method, url},
    statusCode
  }), `${method} ${url} Returned HTTP ${statusCode} (${http.STATUS_CODES[statusCode]}) --> "hello"`)
  t.throws(() => client.handleErrors({
    error: {response: {result: {error: 'hello'}}},
    options: {method, url},
    statusCode
  }), `${method} ${url} Returned HTTP ${statusCode} (${http.STATUS_CODES[statusCode]}) --> "hello"`)
  t.throws(() => client.handleErrors({
    error: {response: {result: {error: {error: 'hello'}}}},
    options: {method, url},
    statusCode
  }), `${method} ${url} Returned HTTP ${statusCode} (${http.STATUS_CODES[statusCode]}) --> "hello"`)
  t.throws(() => client.handleErrors({
    error: {response: {result: {error: {statusCode: 404}}}},
    options: {method, url},
    statusCode
  }), `${method} ${url} Returned HTTP ${statusCode} (${http.STATUS_CODES[statusCode]}) --> "application error, status code: ${404}"`)
})

test('should throw errors for non-HTTP response failures', t => {
  const client = new Client({apiKey: true, api: true})
  t.throws(() => client.handleErrors({message: 'error message'}), /error message/)
})

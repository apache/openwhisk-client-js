// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

'use strict'

const test = require('ava')
const Client = require('../../lib/client')
const http = require('http')

test('should use default constructor options', t => {
  const client = new Client({api_key: 'aaa', apihost: 'my_host'})
  t.false(client.options.ignoreCerts)
  t.is(client.options.apiKey, 'aaa')
  t.is(client.options.apiVersion, 'v1')
  t.is(client.options.api, 'https://my_host/api/v1/')
  t.falsy(client.options.namespace)
  t.falsy(client.options.cert)
  t.falsy(client.options.key)
})

test('should support explicit constructor options', t => {
  const client = new Client({
    namespace: 'ns',
    ignore_certs: true,
    api_key: 'aaa',
    api: 'my_host',
    apiversion: 'v2',
    apigw_token: 'oauth_token',
    apigw_space_guid: 'space_guid',
    cert: 'mycert=',
    key: 'mykey='
  })
  t.is(client.options.api, 'my_host')
  t.is(client.options.apiVersion, 'v2')
  t.true(client.options.ignoreCerts)
  t.is(client.options.namespace, 'ns')
  t.is(client.options.apigwToken, 'oauth_token')
  t.is(client.options.apigwSpaceGuid, 'space_guid')
  t.is(client.options.cert, 'mycert=')
  t.is(client.options.key, 'mykey=')
})

test('apihost and apiversion set', t => {
  const client = new Client({
    api_key: 'aaa',
    apihost: 'https://my_host',
    apiversion: 'v2'
  })
  t.is(client.options.api, 'https://my_host/api/v2/')
  t.is(client.options.apiVersion, 'v2')
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

test('should use uuid from auth key as space guid if apigw_token present', t => {
  const client = new Client({
    namespace: 'ns',
    ignore_certs: true,
    api_key: 'uuid:pass',
    api: 'my_host',
    apigw_token: 'oauth_token'
  })
  t.is(client.options.apigwSpaceGuid, 'uuid')
})

test('should use environment parameters for options if not set explicitly.', t => {
  process.env['__OW_API_KEY'] = 'some_user:some_pass'
  process.env['__OW_API_HOST'] = 'mywhiskhost'
  process.env['__OW_IGNORE_CERTS'] = 'true'
  process.env['__OW_APIGW_TOKEN'] = 'my-token'
  process.env['__OW_APIGW_SPACE_GUID'] = 'my-space'
  const client = new Client()
  t.is(client.options.apiKey, process.env['__OW_API_KEY'])
  t.is(client.options.api, 'https://mywhiskhost/api/v1/')
  t.is(client.options.ignoreCerts, true)
  t.is(client.options.apigwToken, 'my-token')
  t.is(client.options.apigwSpaceGuid, 'my-space')
  delete process.env['__OW_API_KEY']
  delete process.env['__OW_API_HOST']
  delete process.env['__OW_IGNORE_CERTS']
  delete process.env['__OW_APIGW_TOKEN']
  delete process.env['__OW_APIGW_SPACE_GUID']
})

test('should use options for parameters even if environment parameters are available.', t => {
  process.env['__OW_API_KEY'] = 'some_user:some_pass'
  process.env['__OW_API_HOST'] = 'mywhiskhost'
  process.env['__OW_APIGW_TOKEN'] = 'my-token'
  process.env['__OW_APIGW_SPACE_GUID'] = 'my-space'
  const client = new Client({apihost: 'openwhisk', api_key: 'mykey', apigw_token: 'token', apigw_space_guid: 'guid'})
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
  t.throws(() => new Client({api: true}), /Missing api_key parameter./)
})

test('should throw error when missing both API and API Host options.', t => {
  t.throws(() => new Client({api_key: true}), /Missing either api or apihost parameters/)
})

test('should handle multiple api parameter formats', t => {
  const client = new Client({api_key: true, apihost: 'blah'})
  t.is(client.urlFromApihost('my_host'), 'https://my_host/api/v1/')
  t.is(client.urlFromApihost('https://my_host:80'), 'https://my_host:80/api/v1/')
  t.is(client.urlFromApihost('http://my_host:80'), 'http://my_host:80/api/v1/')
})

test('should return default request parameters without options', async t => {
  const client = new Client({api_key: 'username:password', apihost: 'blah'})
  const METHOD = 'get'
  const PATH = 'some/path/to/resource'

  const params = await client.params(METHOD, PATH)
  t.is(params.url, 'https://blah/api/v1/some/path/to/resource')
  t.is(params.method, METHOD)
  t.true(params.json)
  t.true(params.rejectUnauthorized)
  t.true(params.headers.hasOwnProperty('Authorization'))
  t.falsy(params.cert)
  t.falsy(params.key)
})

test('should return request parameters with merged options', async t => {
  const client = new Client({api_key: 'username:password', apihost: 'blah'})
  const METHOD = 'get'
  const PATH = 'some/path/to/resource'
  const OPTIONS = {b: {bar: 'foo'}, a: {foo: 'bar'}}

  const params = await client.params(METHOD, PATH, OPTIONS)
  t.is(params.url, 'https://blah/api/v1/some/path/to/resource')
  t.is(params.method, METHOD)
  t.true(params.json)
  t.true(params.rejectUnauthorized)
  t.true(params.headers.hasOwnProperty('Authorization'))
  t.deepEqual(params.a, {foo: 'bar'})
  t.deepEqual(params.b, {bar: 'foo'})
})

test('should return request parameters with cert and key client options', async t => {
  const client = new Client({api_key: 'username:password', apihost: 'blah', cert: 'mycert=', key: 'mykey='})
  const METHOD = 'get'
  const PATH = 'some/path/to/resource'
  const OPTIONS = { myoption: true }

  const params = await client.params(METHOD, PATH, OPTIONS)
  t.is(params.url, 'https://blah/api/v1/some/path/to/resource')
  t.is(params.method, METHOD)
  t.is(params.cert, 'mycert=')
  t.is(params.key, 'mykey=')
})

test('should be able to set proxy uri as client options.', async t => {
  const PROXY_URL = 'http://some_proxy:5678'
  const METHOD = 'get'
  const PATH = 'some/path/to/resource'
  const OPTIONS = {}

  const client = new Client({api_key: 'username:password', apihost: 'blah', proxy: PROXY_URL})
  const params = await client.params(METHOD, PATH, OPTIONS)
  t.is(params.proxy, PROXY_URL)
})

test('should be able to set http agent using client options.', async t => {
  const METHOD = 'get'
  const PATH = 'some/path/to/resource'
  const OPTIONS = {}

  const agent = new http.Agent({})
  const client = new Client({api_key: 'username:password', apihost: 'blah', agent})
  const params = await client.params(METHOD, PATH, OPTIONS)
  t.is(params.agent, agent)
})

test('should be able to use env params to set proxy option.', async t => {
  const PROXY_URL = 'https://some_proxy:1234'
  const METHOD = 'get'
  const PATH = 'some/path/to/resource'
  const OPTIONS = {}

  const ENV_PARAMS = ['proxy', 'PROXY', 'http_proxy', 'HTTP_PROXY',
    'https_proxy', 'HTTPS_PROXY']

  for (let envParam of ENV_PARAMS) {
    process.env[envParam] = PROXY_URL
    const client = new Client({api_key: 'username:password', apihost: 'blah'})
    const params = await client.params(METHOD, PATH, OPTIONS)
    t.is(params.proxy, PROXY_URL, `Cannot set proxy using ${envParam}`)
    delete process.env[envParam]
  }
})

test('should return request parameters with explicit api option', async t => {
  const client = new Client({api_key: 'username:password', api: 'https://api.com/api/v1'})
  const METHOD = 'get'
  const PATH = 'some/path/to/resource'

  t.is((await client.params(METHOD, PATH)).url, 'https://api.com/api/v1/some/path/to/resource')
  client.options.api += '/'
  t.is((await client.params(METHOD, PATH)).url, 'https://api.com/api/v1/some/path/to/resource')
})

test('should generate auth header from API key', async t => {
  const apiKey = 'some sample api key'
  const client = new Client({api: true, api_key: apiKey})
  t.is(await client.authHeader(), `Basic ${Buffer.from(apiKey).toString('base64')}`)
})

test('should generate auth header from 3rd party authHandler plugin', async t => {
  const authHandler = {
    getAuthHeader: () => {
      return Promise.resolve('Basic user:password')
    }
  }
  const client = new Client({api: true, auth_handler: authHandler})
  t.is(await client.authHeader(), `Basic user:password`)
})

test('should return path and status code in error message', t => {
  const client = new Client({api_key: true, api: true})
  const method = 'METHOD'
  const url = 'https://blah.com/api/v1/actions/list'
  const statusCode = 400
  t.throws(() => client.handleErrors({
    options: {method, url},
    statusCode
  }), `${method} ${url} Returned HTTP ${statusCode} (${http.STATUS_CODES[statusCode]}) --> "Response Missing Error Message."`)
})

test('should return response error string in error message', t => {
  const client = new Client({api_key: true, api: true})
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
  const client = new Client({api_key: true, api: true})
  t.throws(() => client.handleErrors({message: 'error message'}), /error message/)
})

test('should contain x-namespace-id header when namespace in contructor options', async t => {
  const authHandler = {
    getAuthHeader: () => {
      return Promise.resolve('Bearer access_token')
    }
  }
  const client = new Client({apihost: 'my_host', namespace: 'ns', auth_handler: authHandler})
  const METHOD = 'POST'
  const PATH = '/publicnamespace/path/to/resource'
  let params = await client.params(METHOD, PATH, {})
  t.is(client.options.namespace, 'ns')
  t.is(params.headers['x-namespace-id'], client.options.namespace)
})

test('should not contain x-namespace-id header when namespace is not in contructor options', async t => {
  const authHandler = {
    getAuthHeader: () => {
      return Promise.resolve('Bearer access_token')
    }
  }
  const client = new Client({apihost: 'my_host', auth_handler: authHandler})
  const METHOD = 'POST'
  const PATH = '/publicnamespace/path/to/resource'
  let params = await client.params(METHOD, PATH, {})
  t.is(params.headers['x-namespace-id'], undefined)
})

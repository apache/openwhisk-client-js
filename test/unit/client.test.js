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
const http = require('http')
const nock = require('nock')
const sinon = require('sinon')

// Note: All client.request tests have to come before any of the proxy tests, as they interfere

test('should return response', async t => {
  const client = new Client({ api_key: 'secret', apihost: 'test_host', proxy: '' })
  const METHOD = 'GET'
  // NOTE: paths must be different as tests are run in parallel and adding/removing nock
  // interceptors for a same path will create race conditions.
  const PATH = '/return/response'

  const mock = nock('https://test_host').get(PATH).times(1).reply(200, 'all good')
  const result = await client.request(METHOD, PATH, {})
  t.is(result.toString(), 'all good')
  mock.interceptors.forEach(nock.removeInterceptor)
})

test('should handle http request errors', async t => {
  const client = new Client({ api_key: 'secret', apihost: 'test_host', proxy: '' })
  const METHOD = 'GET'
  const PATH = '/handle/error'

  const mock = nock('https://test_host').get(PATH).times(1).replyWithError('simulated error')
  const error = await t.throwsAsync(client.request(METHOD, PATH, {}))
  t.truthy(error.message)
  t.assert(error.message.includes('simulated error'))
  mock.interceptors.forEach(nock.removeInterceptor)
})

test('should support retries on error', async t => {
  const retrySpy = sinon.spy()
  const client = new Client({ api_key: 'secret', apihost: 'test_host', proxy: '', retry: { retries: 2, onRetry: retrySpy } })
  const METHOD = 'GET'
  const PATH = '/retry/on/error'

  const mock = nock('https://test_host')
    .get(PATH).times(2).replyWithError('simulated error')
    .get(PATH).times(1).reply(200, 'now all good')
  const result = await client.request(METHOD, PATH, {})
  t.is(result.toString(), 'now all good')
  t.is(retrySpy.callCount, 2)
  mock.interceptors.forEach(nock.removeInterceptor)
})

test('should not retry on success', async t => {
  const retrySpy = sinon.spy()
  const client = new Client({ api_key: 'secret', apihost: 'test_host', proxy: '', retry: { retries: 10, onRetry: retrySpy } })
  const METHOD = 'GET'
  const PATH = '/no/retry/on/sucess'

  const mock = nock('https://test_host')
    .get(PATH).times(1).reply(200, 'now all good')
  const result = await client.request(METHOD, PATH, {})
  t.is(result.toString(), 'now all good')
  t.is(retrySpy.callCount, 0) // => no retries
  mock.interceptors.forEach(nock.removeInterceptor)
})

test('should not retry when no retry config available', async t => {
  const client = new Client({ api_key: 'secret', apihost: 'test_host', proxy: '' })
  const METHOD = 'GET'
  const PATH = '/no/config/no/retry'

  const mock = nock('https://test_host')
    .get(PATH).times(1).replyWithError('simulated error')
    .get(PATH).times(1).reply(200, 'now all good')
  const error = await t.throwsAsync(client.request(METHOD, PATH, {}))
  t.truthy(error.message)
  t.assert(error.message.includes('simulated error'))
  mock.interceptors.forEach(nock.removeInterceptor)
})

test('should handle errors even after retries', async t => {
  const retrySpy = sinon.spy()
  const client = new Client({ api_key: 'secret', apihost: 'test_host', proxy: '', retry: { retries: 2, onRetry: retrySpy } })
  const METHOD = 'GET'
  const PATH = '/handle/error/on/retry'

  const mock = nock('https://test_host')
    .get(PATH).times(3).replyWithError('simulated error')
    .get(PATH).times(1).reply(200, 'not enough retries to come here')
  const error = await t.throwsAsync(client.request(METHOD, PATH, {}))
  t.truthy(error.message)
  t.assert(error.message.includes('simulated error'))
  mock.interceptors.forEach(nock.removeInterceptor)
})

test('should retry with same url + querystring', async t => {
  const calledUrls = []
  const retrySpy = sinon.spy((error) => {
    if (error && error.options) {
      calledUrls.push(error.options.url)
    }
  })
  const client = new Client({ api_key: 'secret', apihost: 'test_host', proxy: '', retry: { retries: 3, onRetry: retrySpy } })
  const METHOD = 'GET'
  const PATH = '/dont/add/to/querystring'
  const options = { qs: { bob: 'your uncle' } }
  const mock = nock('https://test_host')
    .get(PATH)
    .query({ bob: 'your uncle' })
    .times(4)
    .replyWithError('simulated error')
    .get(PATH).times(1).reply(200, 'not enough retries to come here')

  const error = await t.throwsAsync(client.request(METHOD, PATH, options))
  t.truthy(error.message)
  t.assert(error.message.includes('simulated error'))
  t.assert(calledUrls.length === 3)
  t.assert(calledUrls[0] === calledUrls[1])
  t.assert(calledUrls[0] === calledUrls[2])

  mock.interceptors.forEach(nock.removeInterceptor)
})

// end client request tests

test('should use default constructor options', t => {
  const client = new Client({ api_key: 'aaa', apihost: 'my_host' })
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

test('option headers are respected', async t => {
  const client = new Client({ api_key: 'username:password', apihost: 'blah' })
  const METHOD = 'get'
  const PATH = 'some/path/to/resource'
  const OPTIONS = { headers: {
    'x-custom-header': 'some-value',
    'User-Agent': 'some-custom-useragent-string'
  } }
  const params = await client.params(METHOD, PATH, OPTIONS)
  t.true(params.headers.hasOwnProperty('Authorization'))
  t.true(params.headers.hasOwnProperty('x-custom-header'))
  // options.headers overwrite defaults if they match
  t.true(params.headers.hasOwnProperty('User-Agent'))
  t.true(params.headers['User-Agent'] === OPTIONS.headers['User-Agent'])
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
  const client = new Client({ apihost: 'openwhisk', api_key: 'mykey', apigw_token: 'token', apigw_space_guid: 'guid' })
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
  t.throws(() => new Client({ api: true }), /Missing api_key parameter./)
})

test('should throw error when missing both API and API Host options.', t => {
  t.throws(() => new Client({ api_key: true }), /Missing either api or apihost parameters/)
})

test('should handle multiple api parameter formats', t => {
  const client = new Client({ api_key: true, apihost: 'blah' })
  t.is(client.urlFromApihost('my_host'), 'https://my_host/api/v1/')
  t.is(client.urlFromApihost('https://my_host:80'), 'https://my_host:80/api/v1/')
  t.is(client.urlFromApihost('http://my_host:80'), 'http://my_host:80/api/v1/')
})

test('should return default request parameters without options', async t => {
  const client = new Client({ api_key: 'username:password', apihost: 'blah' })
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
  const client = new Client({ api_key: 'username:password', apihost: 'blah' })
  const METHOD = 'get'
  const PATH = 'some/path/to/resource'
  const OPTIONS = { b: { bar: 'foo' }, a: { foo: 'bar' } }

  const params = await client.params(METHOD, PATH, OPTIONS)
  t.is(params.url, 'https://blah/api/v1/some/path/to/resource')
  t.is(params.method, METHOD)
  t.true(params.json)
  t.true(params.rejectUnauthorized)
  t.true(params.headers.hasOwnProperty('Authorization'))
  t.deepEqual(params.a, { foo: 'bar' })
  t.deepEqual(params.b, { bar: 'foo' })
})

test('should return request parameters transaction id', async t => {
  process.env['__OW_TRANSACTION_ID'] = 'example-transaction-id'
  const client = new Client({ api_key: 'username:password', apihost: 'blah' })
  const METHOD = 'get'
  const PATH = 'some/path/to/resource'

  const params = await client.params(METHOD, PATH)
  t.is(params.headers['x-request-id'], 'example-transaction-id')
  delete process.env['__OW_TRANSACTION_ID']
})

test('should return request parameters with cert and key client options', async t => {
  const client = new Client({ api_key: 'username:password', apihost: 'blah', cert: 'mycert=', key: 'mykey=' })
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

  const client = new Client({ api_key: 'username:password', apihost: 'blah', proxy: PROXY_URL })
  const params = await client.params(METHOD, PATH, OPTIONS)
  t.is(params.proxy, PROXY_URL)
})

test('should be able to set http agent using client options.', async t => {
  const METHOD = 'get'
  const PATH = 'some/path/to/resource'
  const OPTIONS = {}

  const agent = new http.Agent({})
  const client = new Client({ api_key: 'username:password', apihost: 'blah', agent })
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
    const client = new Client({ api_key: 'username:password', apihost: 'blah' })
    const params = await client.params(METHOD, PATH, OPTIONS)
    t.is(params.proxy, PROXY_URL, `Cannot set proxy using ${envParam}`)
    delete process.env[envParam]
  }
})

test('should return request parameters with explicit api option', async t => {
  const client = new Client({ api_key: 'username:password', api: 'https://api.com/api/v1' })
  const METHOD = 'get'
  const PATH = 'some/path/to/resource'

  t.is((await client.params(METHOD, PATH)).url, 'https://api.com/api/v1/some/path/to/resource')
  client.options.api += '/'
  t.is((await client.params(METHOD, PATH)).url, 'https://api.com/api/v1/some/path/to/resource')
})

test('should generate auth header from API key', async t => {
  const apiKey = 'some sample api key'
  const client = new Client({ api: true, api_key: apiKey })
  t.is(await client.authHeader(), `Basic ${Buffer.from(apiKey).toString('base64')}`)
})

test('should generate auth header from 3rd party authHandler plugin', async t => {
  const authHandler = {
    getAuthHeader: () => {
      return Promise.resolve('Basic user:password')
    }
  }
  const client = new Client({ api: true, auth_handler: authHandler })
  t.is(await client.authHeader(), `Basic user:password`)
})

test('should return path and status code in error message', t => {
  const client = new Client({ api_key: true, api: true })
  const method = 'METHOD'
  const url = 'https://blah.com/api/v1/actions/list'
  const statusCode = 400
  t.throws(() => client.handleErrors({
    options: { method, url },
    statusCode
  }), `${method} ${url} Returned HTTP ${statusCode} (${http.STATUS_CODES[statusCode]}) --> "Response Missing Error Message."`)
})

test('should return response error string in error message', t => {
  const client = new Client({ api_key: true, api: true })
  const method = 'METHOD'
  const url = 'https://blah.com/api/v1/actions/list'
  const statusCode = 400
  t.throws(() => client.handleErrors({
    error: { error: 'hello' },
    options: { method, url },
    statusCode
  }), `${method} ${url} Returned HTTP ${statusCode} (${http.STATUS_CODES[statusCode]}) --> "hello"`)
  t.throws(() => client.handleErrors({
    error: { response: { result: { error: 'hello' } } },
    options: { method, url },
    statusCode
  }), `${method} ${url} Returned HTTP ${statusCode} (${http.STATUS_CODES[statusCode]}) --> "hello"`)
  t.throws(() => client.handleErrors({
    error: { response: { result: { error: { error: 'hello' } } } },
    options: { method, url },
    statusCode
  }), `${method} ${url} Returned HTTP ${statusCode} (${http.STATUS_CODES[statusCode]}) --> "hello"`)
  t.throws(() => client.handleErrors({
    error: { response: { result: { error: { statusCode: 404 } } } },
    options: { method, url },
    statusCode
  }), `${method} ${url} Returned HTTP ${statusCode} (${http.STATUS_CODES[statusCode]}) --> "application error, status code: ${404}"`)
})

test('should throw errors for non-HTTP response failures', t => {
  const client = new Client({ api_key: true, api: true })
  t.throws(() => client.handleErrors({ message: 'error message' }), /error message/)
})

test('should contain x-namespace-id header when namespace in constructor options', async t => {
  const authHandler = {
    getAuthHeader: () => {
      return Promise.resolve('Bearer access_token')
    }
  }
  const client = new Client({ apihost: 'my_host', namespace: 'ns', auth_handler: authHandler })
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
  const client = new Client({ apihost: 'my_host', auth_handler: authHandler })
  const METHOD = 'POST'
  const PATH = '/publicnamespace/path/to/resource'
  let params = await client.params(METHOD, PATH, {})
  t.is(params.headers['x-namespace-id'], undefined)
})

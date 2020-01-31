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
const Routes = require('../../lib/routes')

test('should retrieve routes from name', t => {
  t.plan(3)
  const client = { options: {} }
  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, routes.routeMgmtApiPath('getApi'))
    t.deepEqual(options.qs, { basepath: 'testing' })
  }

  const routes = new Routes(client)
  return routes.get({ name: 'testing' })
})

test('should retrieve routes from basepath', t => {
  t.plan(3)
  const client = { options: {} }
  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, routes.routeMgmtApiPath('getApi'))
    t.deepEqual(options.qs, { basepath: 'testing' })
  }

  const routes = new Routes(client)
  return routes.get({ basepath: 'testing' })
})

test('should retrieve routes with apigwToken and name', t => {
  t.plan(3)
  const client = {
    options: {
      apigwToken: 'token',
      apigwSpaceGuid: 'space'
    }
  }
  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, routes.routeMgmtApiPath('getApi'))
    t.deepEqual(options.qs, { basepath: 'testing', spaceguid: 'space', accesstoken: 'token' })
  }

  const routes = new Routes(client)
  return routes.get({ name: 'testing' })
})

test('should retrieve routes with apigwToken and basepath', t => {
  t.plan(3)
  const client = {
    options: {
      apigwToken: 'token',
      apigwSpaceGuid: 'space'
    }
  }
  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, routes.routeMgmtApiPath('getApi'))
    t.deepEqual(options.qs, { basepath: 'testing', spaceguid: 'space', accesstoken: 'token' })
  }

  const routes = new Routes(client)
  return routes.get({ basepath: 'testing' })
})

test('get routes with incorrect parameters', t => {
  const routes = new Routes({ options: {} })
  t.throws(() => { routes.get() }, /Missing mandatory parameters: basepath or name/)
  t.throws(() => { routes.get({}) }, /Missing mandatory parameters: basepath or name/)
  t.throws(() => { routes.get({ basepath: 'id', name: 'id' }) }, /Invalid parameters: use basepath or name, not both/)
})

// OVERRIDE gateway package
test('should override package name for apigateway', t => {
  t.plan(3)
  const client = { options: {} }
  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, routes.routeMgmtApiPath('getApi'))
    t.is(path, 'foo/bar/baz/getApi')
  }

  const routes = new Routes(client, (p) => `foo/bar/baz/${p}`)
  return routes.list()
})

// ADD NAME TO OTHER METHODS

test('should list all routes', t => {
  t.plan(2)
  const client = { options: {} }
  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, routes.routeMgmtApiPath('getApi'))
  }

  const routes = new Routes(client)
  return routes.list()
})

test('should list all routes with apigwToken', t => {
  t.plan(3)
  const client = {
    options: {
      apigwToken: 'token',
      apigwSpaceGuid: 'space'
    }
  }
  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, routes.routeMgmtApiPath('getApi'))
    t.deepEqual(options.qs, { spaceguid: 'space', accesstoken: 'token' })
  }

  const routes = new Routes(client)
  return routes.list()
})

test('should list all routes with parameters including basepath', t => {
  t.plan(3)
  const client = { options: {} }
  const options = { basepath: '/hello', relpath: '/foo/bar', operation: 'GET', limit: 10, skip: 10 }
  client.request = (method, path, _options) => {
    t.is(method, 'GET')
    t.is(path, routes.routeMgmtApiPath('getApi'))
    t.deepEqual(_options.qs, options)
  }

  const routes = new Routes(client)
  return routes.list(options)
})

test('should list all routes with parameters including name', t => {
  t.plan(3)
  const client = { options: {} }
  const options = { name: '/hello', relpath: '/foo/bar', operation: 'GET', limit: 10, skip: 10 }
  const qsOptions = { basepath: '/hello', relpath: '/foo/bar', operation: 'GET', limit: 10, skip: 10 }
  client.request = (method, path, _options) => {
    t.is(method, 'GET')
    t.is(path, routes.routeMgmtApiPath('getApi'))
    t.deepEqual(_options.qs, qsOptions)
  }

  const routes = new Routes(client)
  return routes.list(options)
})

test('list routes providing basepath and name', t => {
  const client = { options: {} }
  const routes = new Routes(client)
  return t.throws(() => {
    routes.list({
      basepath: 'bp',
      name: 'nm'
    })
  }, /Invalid parameters: use basepath or name, not both/)
})

test('should delete a route with basepath', t => {
  t.plan(3)
  const client = { options: {} }
  const options = { force: true, basepath: '/hello' }

  client.request = (method, path, _options) => {
    t.is(method, 'DELETE')
    t.is(path, routes.routeMgmtApiPath('deleteApi'))
    t.deepEqual(_options.qs, options)
  }

  const routes = new Routes(client)
  return routes.delete({ basepath: '/hello' })
})

test('should delete a route with name', t => {
  t.plan(3)
  const client = { options: {} }
  const options = { force: true, basepath: '/hello' }

  client.request = (method, path, _options) => {
    t.is(method, 'DELETE')
    t.is(path, routes.routeMgmtApiPath('deleteApi'))
    t.deepEqual(_options.qs, options)
  }

  const routes = new Routes(client)
  return routes.delete({ name: '/hello' })
})

test('should delete a route with apigw token', t => {
  t.plan(3)
  const client = {
    options: {
      apigwToken: 'token',
      apigwSpaceGuid: 'space'
    }
  }

  client.request = (method, path, options) => {
    t.is(method, 'DELETE')
    t.is(path, routes.routeMgmtApiPath('deleteApi'))
    t.deepEqual(options.qs, { basepath: '/hello', force: true, spaceguid: 'space', accesstoken: 'token' })
  }

  const routes = new Routes(client)
  return routes.delete({ basepath: '/hello' })
})

test('should delete a route with parameters', t => {
  t.plan(3)
  const client = { options: {} }
  const options = { force: true, basepath: '/hello', relpath: '/bar/1', operation: 'GET' }

  client.request = (method, path, _options) => {
    t.is(method, 'DELETE')
    t.is(path, routes.routeMgmtApiPath('deleteApi'))
    t.deepEqual(_options.qs, options)
  }

  const routes = new Routes(client)
  return routes.delete({ basepath: '/hello', relpath: '/bar/1', operation: 'GET' })
})

test('delete routes without providing basepath or name', t => {
  const client = { options: {} }
  const routes = new Routes(client)
  return t.throws(() => { routes.delete() }, /Missing mandatory parameters: basepath or name/)
})

test('delete routes providing basepath and name', t => {
  const client = { options: {} }
  const routes = new Routes(client)
  return t.throws(() => {
    routes.delete({
      basepath: 'bp',
      name: 'nm'
    })
  }, /Invalid parameters: use basepath or name, not both/)
})

test('should create a route', t => {
  t.plan(3)
  const pathUrl = path => `https://example.com/api/v1/${path}`
  const apiKey = 'username:password'
  const clientOptions = { apiKey }
  const client = { pathUrl, options: clientOptions }

  const body = {
    apidoc: {
      namespace: '_',
      gatewayBasePath: '/',
      gatewayPath: '/hello',
      gatewayMethod: 'GET',
      id: 'API:_:/',
      action: {
        name: 'helloAction',
        namespace: '_',
        backendMethod: 'GET',
        backendUrl: 'https://example.com/api/v1/web/_/default/helloAction.http',
        authkey: apiKey
      }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
  }

  const routes = new Routes(client)
  return routes.create({ relpath: '/hello', operation: 'GET', action: 'helloAction' })
})

test('should create a route from swagger file', t => {
  t.plan(3)
  const pathUrl = path => `https://example.com/api/v1/${path}`
  const apiKey = 'username:password'
  const clientOptions = { apiKey }
  const client = { pathUrl, options: clientOptions }

  const body = {
    apidoc: {
      namespace: '_',
      swagger: '{"hello": "world"}'
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
  }

  const routes = new Routes(client)
  return routes.create({ swagger: '{"hello": "world"}' })
})

test('should create a route with api name', t => {
  t.plan(3)
  const pathUrl = path => `https://example.com/api/v1/${path}`
  const apiKey = 'username:password'
  const clientOptions = { apiKey }
  const client = { pathUrl, options: clientOptions }

  const body = {
    apidoc: {
      namespace: '_',
      apiName: 'SOME_NAME',
      gatewayBasePath: '/',
      gatewayPath: '/hello',
      gatewayMethod: 'GET',
      id: 'API:_:/',
      action: {
        name: 'helloAction',
        namespace: '_',
        backendMethod: 'GET',
        backendUrl: 'https://example.com/api/v1/web/_/default/helloAction.http',
        authkey: apiKey
      }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
  }

  const routes = new Routes(client)
  return routes.create({ relpath: '/hello', operation: 'GET', action: 'helloAction', name: 'SOME_NAME' })
})

test('should create a route with apigwToken', t => {
  t.plan(4)
  const pathUrl = path => `https://example.com/api/v1/${path}`
  const apiKey = 'username:password'
  const clientOptions = { apiKey, apigwToken: 'token', apigwSpaceGuid: 'space' }
  const client = { pathUrl, options: clientOptions }

  const body = {
    apidoc: {
      namespace: '_',
      gatewayBasePath: '/',
      gatewayPath: '/hello',
      gatewayMethod: 'GET',
      id: 'API:_:/',
      action: {
        name: 'helloAction',
        namespace: '_',
        backendMethod: 'GET',
        backendUrl: 'https://example.com/api/v1/web/_/default/helloAction.http',
        authkey: apiKey
      }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
    t.deepEqual(_options.qs, { spaceguid: 'space', accesstoken: 'token' })
  }

  const routes = new Routes(client)
  return routes.create({ relpath: '/hello', operation: 'GET', action: 'helloAction' })
})

test('should create a route with response type', t => {
  t.plan(4)
  const pathUrl = path => `https://example.com/api/v1/${path}`
  const apiKey = 'username:password'
  const clientOptions = { apiKey }
  const client = { pathUrl, options: clientOptions }

  const body = {
    apidoc: {
      namespace: '_',
      gatewayBasePath: '/',
      gatewayPath: '/hello',
      gatewayMethod: 'GET',
      id: 'API:_:/',
      action: {
        name: 'helloAction',
        namespace: '_',
        backendMethod: 'GET',
        backendUrl: 'https://example.com/api/v1/web/_/default/helloAction.http',
        authkey: apiKey
      }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
    t.deepEqual(_options.qs, { responsetype: 'http' })
  }

  const routes = new Routes(client)
  return routes.create({ relpath: '/hello', operation: 'GET', action: 'helloAction', responsetype: 'http' })
})

test('should create a route with secure key', t => {
  t.plan(3)
  const pathUrl = path => `https://example.com/api/v1/${path}`
  const apiKey = 'username:password'
  const secureKey = 'some_key'
  const clientOptions = { apiKey }
  const client = { pathUrl, options: clientOptions }

  const body = {
    apidoc: {
      namespace: '_',
      gatewayBasePath: '/',
      gatewayPath: '/hello',
      gatewayMethod: 'GET',
      id: 'API:_:/',
      action: {
        name: 'helloAction',
        namespace: '_',
        backendMethod: 'GET',
        backendUrl: 'https://example.com/api/v1/web/_/default/helloAction.http',
        authkey: apiKey,
        secureKey: secureKey
      }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
  }

  const routes = new Routes(client)
  return routes.create({ relpath: '/hello', operation: 'GET', action: 'helloAction', secure_key: secureKey })
})

test('should create a route with apigwToken and action with package', t => {
  t.plan(4)
  const pathUrl = path => `https://example.com/api/v1/${path}`
  const apiKey = 'username:password'
  const clientOptions = { apiKey, apigwToken: 'token', apigwSpaceGuid: 'space' }
  const client = { pathUrl, options: clientOptions }

  const body = {
    apidoc: {
      namespace: '_',
      gatewayBasePath: '/',
      gatewayPath: '/hello',
      gatewayMethod: 'GET',
      id: 'API:_:/',
      action: {
        name: 'package/helloAction',
        namespace: '_',
        backendMethod: 'GET',
        backendUrl: 'https://example.com/api/v1/web/_/package/helloAction.http',
        authkey: apiKey
      }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
    t.deepEqual(_options.qs, { spaceguid: 'space', accesstoken: 'token' })
  }

  const routes = new Routes(client)
  return routes.create({ relpath: '/hello', operation: 'GET', action: 'package/helloAction' })
})

test('should create a route with apigwToken and action with package & ns', t => {
  t.plan(4)
  const pathUrl = path => `https://example.com/api/v1/${path}`
  const apiKey = 'username:password'
  const clientOptions = { apiKey, apigwToken: 'token', apigwSpaceGuid: 'space' }
  const client = { pathUrl, options: clientOptions }

  const body = {
    apidoc: {
      namespace: '_',
      gatewayBasePath: '/',
      gatewayPath: '/hello',
      gatewayMethod: 'GET',
      id: 'API:_:/',
      action: {
        name: 'package/helloAction',
        namespace: 'ns',
        backendMethod: 'GET',
        backendUrl: 'https://example.com/api/v1/web/ns/package/helloAction.http',
        authkey: apiKey
      }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
    t.deepEqual(_options.qs, { spaceguid: 'space', accesstoken: 'token' })
  }

  const routes = new Routes(client)
  return routes.create({ relpath: '/hello', operation: 'GET', action: '/ns/package/helloAction' })
})

test('should create a route using global ns', t => {
  t.plan(3)
  const pathUrl = path => `https://example.com/api/v1/${path}`
  const apiKey = 'username:password'
  const clientOptions = { apiKey, namespace: 'global_ns' }
  const client = { pathUrl, options: clientOptions }

  const body = {
    apidoc: {
      namespace: '_',
      gatewayBasePath: '/',
      gatewayPath: '/hello',
      gatewayMethod: 'GET',
      id: 'API:_:/',
      action: {
        name: 'helloAction',
        namespace: 'global_ns',
        backendMethod: 'GET',
        backendUrl: 'https://example.com/api/v1/web/global_ns/default/helloAction.http',
        authkey: apiKey
      }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
  }

  const routes = new Routes(client)
  return routes.create({ relpath: '/hello', operation: 'GET', action: 'helloAction' })
})

test('should create a route using basepath', t => {
  t.plan(3)
  const pathUrl = path => `https://example.com/api/v1/${path}`
  const apiKey = 'username:password'
  const clientOptions = { apiKey }
  const client = { pathUrl, options: clientOptions }

  const body = {
    apidoc: {
      namespace: '_',
      gatewayBasePath: '/foo',
      gatewayPath: '/hello',
      gatewayMethod: 'GET',
      id: 'API:_:/foo',
      action: {
        name: 'helloAction',
        namespace: '_',
        backendMethod: 'GET',
        backendUrl: 'https://example.com/api/v1/web/_/default/helloAction.http',
        authkey: apiKey
      }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
  }

  const routes = new Routes(client)
  return routes.create({ basepath: '/foo', relpath: '/hello', operation: 'GET', action: 'helloAction' })
})

test('should create a route using fully-qualified action name', t => {
  t.plan(3)
  const pathUrl = path => `https://example.com/api/v1/${path}`
  const apiKey = 'username:password'
  const clientOptions = { apiKey }
  const client = { pathUrl, options: clientOptions }

  const body = {
    apidoc: {
      namespace: '_',
      gatewayBasePath: '/',
      gatewayPath: '/hello',
      gatewayMethod: 'GET',
      id: 'API:_:/',
      action: {
        name: 'foo/helloAction',
        namespace: 'test',
        backendMethod: 'GET',
        backendUrl: 'https://example.com/api/v1/web/test/foo/helloAction.http',
        authkey: apiKey
      }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
  }

  const routes = new Routes(client)
  return routes.create({ relpath: '/hello', operation: 'GET', action: '/test/foo/helloAction' })
})

test('should create a route using action name with ns', t => {
  t.plan(3)
  const pathUrl = path => `https://example.com/api/v1/${path}`
  const apiKey = 'username:password'
  const clientOptions = { apiKey: apiKey }
  const client = { pathUrl, options: clientOptions }

  const body = {
    apidoc: {
      namespace: '_',
      gatewayBasePath: '/',
      gatewayPath: '/hello',
      gatewayMethod: 'GET',
      id: 'API:_:/',
      action: {
        name: 'helloAction',
        namespace: 'test',
        backendMethod: 'GET',
        backendUrl: 'https://example.com/api/v1/web/test/default/helloAction.http',
        authkey: apiKey
      }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
  }

  const routes = new Routes(client)
  return routes.create({ relpath: '/hello', operation: 'GET', action: '/test/helloAction' })
})

test('should create a route using action name with ns overriding defaults', t => {
  t.plan(3)
  const pathUrl = path => `https://example.com/api/v1/${path}`
  const apiKey = 'username:password'
  const clientOptions = { apiKey, namespace: 'global' }
  const client = { pathUrl, options: clientOptions }

  const body = {
    apidoc: {
      namespace: '_',
      gatewayBasePath: '/',
      gatewayPath: '/hello',
      gatewayMethod: 'GET',
      id: 'API:_:/',
      action: {
        name: 'helloAction',
        namespace: 'test',
        backendMethod: 'GET',
        backendUrl: 'https://example.com/api/v1/web/test/default/helloAction.http',
        authkey: apiKey
      }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
  }

  const routes = new Routes(client)
  return routes.create({ relpath: '/hello', operation: 'GET', action: '/test/helloAction' })
})

test('should create a route with path parameters', t => {
  t.plan(3)
  const pathUrl = path => `https://example.com/api/v1/${path}`
  const apiKey = 'username:password'
  const clientOptions = { apiKey }
  const client = { pathUrl, options: clientOptions }

  const body = {
    apidoc: {
      namespace: '_',
      gatewayBasePath: '/',
      gatewayPath: '/foo/{bar}/{baz}',
      gatewayMethod: 'GET',
      id: 'API:_:/',
      action: {
        name: 'helloAction',
        namespace: '_',
        backendMethod: 'GET',
        backendUrl: 'https://example.com/api/v1/web/_/default/helloAction.http',
        authkey: apiKey
      },
      pathParameters: [
        {
          name: 'bar',
          in: 'path',
          description: "Default description for 'bar'",
          required: true,
          type: 'string'
        },
        {
          name: 'baz',
          in: 'path',
          description: "Default description for 'baz'",
          required: true,
          type: 'string'
        }
      ]
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
  }

  const routes = new Routes(client)
  return routes.create({ relpath: '/foo/{bar}/{baz}', operation: 'GET', action: 'helloAction' })
})

test('should parse path parameters', t => {
  const routes = new Routes()
  t.deepEqual(routes.parsePathParameters('/foo/{bar}'), ['bar'])
  t.deepEqual(routes.parsePathParameters('/{foo}/bar'), ['foo'])
  t.deepEqual(routes.parsePathParameters('/{foo}/{bar}'), ['foo', 'bar'])

  t.deepEqual(routes.parsePathParameters('/{foo}bar}'), ['foo'])
  t.deepEqual(routes.parsePathParameters('/{foo}{bar}'), ['foo', 'bar'])
  t.deepEqual(routes.parsePathParameters('/a{foo}c{bar}b'), ['foo', 'bar'])

  t.deepEqual(routes.parsePathParameters('/foo/bar'), [])
  t.deepEqual(routes.parsePathParameters('/{foo/bar}'), [])
  t.deepEqual(routes.parsePathParameters('/foo/bar}'), [])
  t.deepEqual(routes.parsePathParameters('/{foo/bar'), [])
})

test('create routes missing mandatory parameters', t => {
  const routes = new Routes()
  t.throws(() => { routes.create() }, /Missing mandatory parameters: relpath, operation, action/)
  t.throws(() => { routes.create({ relpath: true, operation: true }) }, /Missing mandatory parameters: action/)
  t.throws(() => { routes.create({ action: true, operation: true }) }, /Missing mandatory parameters: relpath/)
  t.throws(() => { routes.create({ relpath: true, action: true }) }, /Missing mandatory parameters: operation/)
})

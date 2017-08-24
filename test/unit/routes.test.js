// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

'use strict'

const test = require('ava')
const Routes = require('../../lib/routes')

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

test('should list all routes with apigw_token', t => {
  t.plan(3)
  const client = { options: {
    apigw_token: 'token',
    apigw_space_guid: 'space'
  } }
  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, routes.routeMgmtApiPath('getApi'))
    t.deepEqual(options.qs, { spaceguid: 'space', accesstoken: 'token'})
  }

  const routes = new Routes(client)
  return routes.list()
})


test('should list all routes with parameters', t => {
  t.plan(3)
  const client = { options: {} }
  const options = {basepath: '/hello', relpath: '/foo/bar', operation: 'GET', limit: 10, skip: 10}
  client.request = (method, path, _options) => {
    t.is(method, 'GET')
    t.is(path, routes.routeMgmtApiPath('getApi'))
    t.deepEqual(_options.qs, options)
  }

  const routes = new Routes(client)
  return routes.list(options)
})

test('should delete a route', t => {
  t.plan(3)
  const client = { options: {} }
  const options = {force: true, basepath: '/hello'}

  client.request = (method, path, _options) => {
    t.is(method, 'DELETE')
    t.is(path, routes.routeMgmtApiPath('deleteApi'))
    t.deepEqual(_options.qs, options)
  }

  const routes = new Routes(client)
  return routes.delete({basepath: '/hello'})
})

test('should delete a route with apigw token', t => {
  t.plan(3)
  const client = { options: {
    apigw_token: 'token',
    apigw_space_guid: 'space'
  } }

  client.request = (method, path, options) => {
    t.is(method, 'DELETE')
    t.is(path, routes.routeMgmtApiPath('deleteApi'))
    t.deepEqual(options.qs, { basepath: '/hello', force: true, spaceguid: 'space', accesstoken: 'token'})
  }

  const routes = new Routes(client)
  return routes.delete({basepath: '/hello'})
})

test('should delete a route with parameters', t => {
  t.plan(3)
  const client = { options: {} }
  const options = {force: true, basepath: '/hello', relpath: '/bar/1', operation: 'GET'}

  client.request = (method, path, _options) => {
    t.is(method, 'DELETE')
    t.is(path, routes.routeMgmtApiPath('deleteApi'))
    t.deepEqual(_options.qs, options)
  }

  const routes = new Routes(client)
  return routes.delete({basepath: '/hello', relpath: '/bar/1', operation: 'GET'})
})

test('delete routes without providing basepath', t => {
  const client = { options: {} }
  const routes = new Routes(client)
  return t.throws(() => { routes.delete() }, /Missing mandatory basepath/)
})

test('should create a route', t => {
  t.plan(3)
  const path_url = path => `https://openwhisk.ng.bluemix.net/api/v1/${path}`
  const api_key = 'username:password'
  const client_options = { api_key }
  const client = { path_url, options: client_options }
  const options = {force: true, basepath: '/hello', relpath: '/bar/1', operation: 'GET'}

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
        backendUrl: 'https://openwhisk.ng.bluemix.net/api/v1/web/_/default/helloAction.http',
        authkey: api_key }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
  }

  const routes = new Routes(client)
  return routes.create({relpath: '/hello', operation: 'GET', action: 'helloAction'})
})

test('should create a route with apigw_token', t => {
  t.plan(4)
  const path_url = path => `https://openwhisk.ng.bluemix.net/api/v1/${path}`
  const api_key = 'username:password'
  const client_options = { api_key, apigw_token: 'token', apigw_space_guid: 'space' }
  const client = { path_url, options: client_options }
  const options = {force: true, basepath: '/hello', relpath: '/bar/1', operation: 'GET'}

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
        backendUrl: 'https://openwhisk.ng.bluemix.net/api/v1/web/_/default/helloAction.http',
        authkey: api_key }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
    t.deepEqual(_options.qs, { spaceguid: 'space', accesstoken: 'token'})
  }

  const routes = new Routes(client)
  return routes.create({relpath: '/hello', operation: 'GET', action: 'helloAction'})
})

test('should create a route with apigw_token and action with package', t => {
  t.plan(4)
  const path_url = path => `https://openwhisk.ng.bluemix.net/api/v1/${path}`
  const api_key = 'username:password'
  const client_options = { api_key, apigw_token: 'token', apigw_space_guid: 'space' }
  const client = { path_url, options: client_options }
  const options = {force: true, basepath: '/hello', relpath: '/bar/1', operation: 'GET'}

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
        backendUrl: 'https://openwhisk.ng.bluemix.net/api/v1/web/_/package/helloAction.http',
        authkey: api_key }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
    t.deepEqual(_options.qs, { spaceguid: 'space', accesstoken: 'token'})
  }

  const routes = new Routes(client)
  return routes.create({relpath: '/hello', operation: 'GET', action: 'package/helloAction'})
})

test('should create a route with apigw_token and action with package & ns', t => {
  t.plan(4)
  const path_url = path => `https://openwhisk.ng.bluemix.net/api/v1/${path}`
  const api_key = 'username:password'
  const client_options = { api_key, apigw_token: 'token', apigw_space_guid: 'space' }
  const client = { path_url, options: client_options }
  const options = {force: true, basepath: '/hello', relpath: '/bar/1', operation: 'GET'}

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
        backendUrl: 'https://openwhisk.ng.bluemix.net/api/v1/web/ns/package/helloAction.http',
        authkey: api_key }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
    t.deepEqual(_options.qs, { spaceguid: 'space', accesstoken: 'token'})
  }

  const routes = new Routes(client)
  return routes.create({relpath: '/hello', operation: 'GET', action: '/ns/package/helloAction'})
})

test('should create a route using global ns', t => {
  t.plan(3)
  const path_url = path => `https://openwhisk.ng.bluemix.net/api/v1/${path}`
  const api_key = 'username:password'
  const client_options = { api_key, namespace: 'global_ns'}
  const client = { path_url, options: client_options}
  const options = {force: true, basepath: '/hello', relpath: '/bar/1', operation: 'GET'}

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
        backendUrl: 'https://openwhisk.ng.bluemix.net/api/v1/web/global_ns/default/helloAction.http',
        authkey: api_key }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
  }

  const routes = new Routes(client)
  return routes.create({relpath: '/hello', operation: 'GET', action: 'helloAction'})
})

test('should create a route using basepath', t => {
  t.plan(3)
  const path_url = path => `https://openwhisk.ng.bluemix.net/api/v1/${path}`
  const api_key = 'username:password'
  const client_options = { api_key }
  const client = { path_url, options: client_options }
  const options = {force: true, basepath: '/hello', relpath: '/bar/1', operation: 'GET'}

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
        backendUrl: 'https://openwhisk.ng.bluemix.net/api/v1/web/_/default/helloAction.http',
        authkey: api_key }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
  }

  const routes = new Routes(client)
  return routes.create({basepath: '/foo', relpath: '/hello', operation: 'GET', action: 'helloAction'})
})

test('should create a route using fully-qualified action name', t => {
  t.plan(3)
  const path_url = path => `https://openwhisk.ng.bluemix.net/api/v1/${path}`
  const api_key = 'username:password'
  const client_options = { api_key }
  const client = { path_url, options: client_options }
  const options = {force: true, basepath: '/hello', relpath: '/bar/1', operation: 'GET'}

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
        backendUrl: 'https://openwhisk.ng.bluemix.net/api/v1/web/test/foo/helloAction.http',
        authkey: api_key }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
  }

  const routes = new Routes(client)
  return routes.create({relpath: '/hello', operation: 'GET', action: '/test/foo/helloAction'})
})

test('should create a route using action name with ns', t => {
  t.plan(3)
  const path_url = path => `https://openwhisk.ng.bluemix.net/api/v1/${path}`
  const api_key = 'username:password'
  const client_options = { api_key }
  const client = { path_url, options: client_options }
  const options = {force: true, basepath: '/hello', relpath: '/bar/1', operation: 'GET'}

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
        backendUrl: 'https://openwhisk.ng.bluemix.net/api/v1/web/test/default/helloAction.http',
        authkey: api_key }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
  }

  const routes = new Routes(client)
  return routes.create({relpath: '/hello', operation: 'GET', action: '/test/helloAction'})
})

test('should create a route using action name with ns overriding defaults', t => {
  t.plan(3)
  const path_url = path => `https://openwhisk.ng.bluemix.net/api/v1/${path}`
  const api_key = 'username:password'
  const client_options = { api_key, namespace: 'global' }
  const client = { path_url, options: client_options }
  const options = {force: true, basepath: '/hello', relpath: '/bar/1', operation: 'GET'}

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
        backendUrl: 'https://openwhisk.ng.bluemix.net/api/v1/web/test/default/helloAction.http',
        authkey: api_key }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, routes.routeMgmtApiPath('createApi'))
    t.deepEqual(_options.body, body)
  }

  const routes = new Routes(client)
  return routes.create({relpath: '/hello', operation: 'GET', action: '/test/helloAction'})
})


test('create routes missing mandatory parameters', t => {
  const routes = new Routes()
  t.throws(() => { routes.create() }, /Missing mandatory parameters: relpath, operation, action/)
  t.throws(() => { routes.create({relpath: true, operation: true}) }, /Missing mandatory parameters: action/)
  t.throws(() => { routes.create({action: true, operation: true}) }, /Missing mandatory parameters: relpath/)
  t.throws(() => { routes.create({relpath: true, action: true}) }, /Missing mandatory parameters: operation/)
})

'use strict'

const test = require('ava')
const Routes = require('../../lib/routes')

test('should list all routes', t => {
  t.plan(2)
  const client = {}
  const ns = '_'
  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `experimental/routemgmt`)
  }

  const routes = new Routes(client)
  return routes.list()
})

test('should list all routes with parameters', t => {
  t.plan(3)
  const client = {}
  const ns = '_'

  const options = {basepath: '/hello', relpath: '/foo/bar', operation: 'GET', limit: 10, skip: 10}
  client.request = (method, path, _options) => {
    t.is(method, 'GET')
    t.is(path, `experimental/routemgmt`)
    t.deepEqual(_options.qs, options)
  }

  const routes = new Routes(client)
  return routes.list(options)
})

test('should delete a route', t => {
  t.plan(3)
  const client = {}
  const ns = '_'
  const options = {force: true, basepath: '/hello'}

  client.request = (method, path, _options) => {
    t.is(method, 'DELETE')
    t.is(path, `experimental/routemgmt`)
    t.deepEqual(_options.qs, options)
  }

  const routes = new Routes(client)
  return routes.delete({basepath: '/hello'})
})

test('should delete a route with parameters', t => {
  t.plan(3)
  const client = {}
  const ns = '_'
  const options = {force: true, basepath: '/hello', relpath: '/bar/1', operation: 'GET'}

  client.request = (method, path, _options) => {
    t.is(method, 'DELETE')
    t.is(path, `experimental/routemgmt`)
    t.deepEqual(_options.qs, options)
  }

  const routes = new Routes(client)
  return routes.delete({basepath: '/hello', relpath: '/bar/1', operation: 'GET'})
})

test('delete routes without providing basepath', t => {
  const client = {}
  const ns = '_'
  const routes = new Routes(client)
  return t.throws(() => { routes.delete() }, /Missing mandatory basepath/)
})

test('should create a route', t => {
  t.plan(3)
  const path_url = path => `https://openwhisk.ng.bluemix.net/api/v1/${path}`
  const api_key = 'username:password'
  const client_options = { api_key }
  const client = { path_url, options: client_options }
  const ns = '_'
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
        backendMethod: 'POST',
        backendUrl: 'https://openwhisk.ng.bluemix.net/api/v1/namespaces/_/actions/helloAction',
        authkey: api_key }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, `experimental/routemgmt`)
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
  const ns = '_'
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
        backendMethod: 'POST',
        backendUrl: 'https://openwhisk.ng.bluemix.net/api/v1/namespaces/_/actions/helloAction',
        authkey: api_key }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, `experimental/routemgmt`)
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
  const ns = '_'
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
        backendMethod: 'POST',
        backendUrl: 'https://openwhisk.ng.bluemix.net/api/v1/namespaces/test/actions/foo/helloAction',
        authkey: api_key }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, `experimental/routemgmt`)
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
  const ns = '_'
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
        backendMethod: 'POST',
        backendUrl: 'https://openwhisk.ng.bluemix.net/api/v1/namespaces/test/actions/helloAction',
        authkey: api_key }
    }
  }

  client.request = (method, path, _options) => {
    t.is(method, 'POST')
    t.is(path, `experimental/routemgmt`)
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

'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')
const stub = {}
const ctor = function (options) { this.options = options }
ctor.prototype = stub

const Routes = proxyquire('../../lib/routes.js', {'./base_operation': ctor})

test('list all routes', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.is(req.url, `${params.api}experimental/routemgmt`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(3)

  const routes = new Routes(params)
  return routes.list()
})

test('list all routes using parameters', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}
  const options = {basepath: '/hello', relpath: '/foo/bar', operation: 'GET', limit: 10, skip: 10}

  stub.request = req => {
    t.is(req.url, `${params.api}experimental/routemgmt`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.deepEqual(req.qs, options)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(4)

  const routes = new Routes(params)
  return routes.list({basepath: '/hello', relpath: '/foo/bar', operation: 'GET', limit: 10, skip: 10})
})

test('delete routes', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}
  const options = {force: true, basepath: '/hello'}

  stub.request = req => {
    t.is(req.url, `${params.api}experimental/routemgmt`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.deepEqual(req.qs, options)
    t.is(req.method, 'DELETE')
    return Promise.resolve()
  }

  t.plan(4)

  const routes = new Routes(params)
  return routes.delete({basepath: '/hello'})
})

test('delete routes with optional parameters', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}
  const options = {force: true, basepath: '/hello', relpath: '/bar/1', operation: 'GET'}

  stub.request = req => {
    t.is(req.url, `${params.api}experimental/routemgmt`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.deepEqual(req.qs, options)
    t.is(req.method, 'DELETE')
    return Promise.resolve()
  }

  t.plan(4)

  const routes = new Routes(params)
  return routes.delete({basepath: '/hello', relpath: '/bar/1', operation: 'GET'})
})

test('delete routes without providing basepath', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const routes = new Routes(params)
  return t.throws(() => { routes.delete() }, /Missing mandatory basepath/)
})

test('create route', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}
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
        authkey: 'user_authorisation_key' }
    }
  }

  stub.request = req => {
    t.is(req.url, `${params.api}experimental/routemgmt`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.deepEqual(req.body, body)
    t.is(req.method, 'POST')
    return Promise.resolve()
  }

  t.plan(4)

  const routes = new Routes(params)
  return routes.create({relpath: '/hello', operation: 'GET', action: 'helloAction'})
})

test('create route using basepath', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}
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
        authkey: 'user_authorisation_key' }
    }
  }

  stub.request = req => {
    t.is(req.url, `${params.api}experimental/routemgmt`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.deepEqual(req.body, body)
    t.is(req.method, 'POST')
    return Promise.resolve()
  }

  t.plan(4)

  const routes = new Routes(params)
  return routes.create({relpath: '/hello', operation: 'GET', action: 'helloAction', basepath: '/foo'})
})

test('create route using fully qualified action name', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}
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
        authkey: 'user_authorisation_key' }
    }
  }

  stub.request = req => {
    t.is(req.url, `${params.api}experimental/routemgmt`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.deepEqual(req.body, body)
    t.is(req.method, 'POST')
    return Promise.resolve()
  }

  t.plan(4)

  const routes = new Routes(params)
  return routes.create({relpath: '/hello', operation: 'GET', action: '/test/foo/helloAction'})
})

test('create route using namespace and action name', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}
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
        authkey: 'user_authorisation_key' }
    }
  }

  stub.request = req => {
    t.is(req.url, `${params.api}experimental/routemgmt`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.deepEqual(req.body, body)
    t.is(req.method, 'POST')
    return Promise.resolve()
  }

  t.plan(4)

  const routes = new Routes(params)
  return routes.create({relpath: '/hello', operation: 'GET', action: '/test/helloAction'})
})

test('create routes missing mandatory parameters', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  const routes = new Routes(params)
  t.throws(() => { routes.create() }, /Missing mandatory parameters: relpath, operation, action/)
  t.throws(() => { routes.create({relpath: true, operation: true}) }, /Missing mandatory parameters: action/)
  t.throws(() => { routes.create({action: true, operation: true}) }, /Missing mandatory parameters: relpath/)
  t.throws(() => { routes.create({relpath: true, action: true}) }, /Missing mandatory parameters: operation/)
})

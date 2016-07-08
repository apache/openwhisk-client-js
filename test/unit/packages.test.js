'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')
const stub = {}
const ctor = function (options) { this.options = options }
ctor.prototype = stub

const Packages = proxyquire('../../lib/packages.js', {'./base_operation': ctor})

test('list all packages', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/packages`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(3)

  const packages = new Packages(params)
  return packages.list()
})

test('list all packages with options', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const options = {limit: 100, skip: 50, namespace: 'sample', public: true}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${options.namespace}/packages`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.deepEqual(req.qs, {limit: 100, skip: 50, public: true})
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(4)

  const packages = new Packages(params)
  return packages.list(options)
})

test('list all packages without providing any namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const packages = new Packages(params)
  return t.throws(() => { packages.list() }, /Missing namespace/)
})

test('get package using default namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const package_name = 'package_name'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/packages/${package_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(3)

  const packages = new Packages(params)
  return packages.get({packageName: package_name})
})

test('get package using options namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const package_name = 'package_name'
  const namespace = 'provided'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${namespace}/packages/${package_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(3)

  const packages = new Packages(params)
  return packages.get({packageName: package_name, namespace: 'provided'})
})

test('get an package without providing any namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const packages = new Packages(params)
  return t.throws(() => { packages.get({packageName: 'custom'}) }, /Missing namespace/)
})

test('get a package without providing a package name', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const packages = new Packages(params)
  return t.throws(() => { packages.get({namespace: 'custom'}) }, /packageName/)
})

test('delete package using default namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const package_name = 'package_name'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/packages/${package_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'DELETE')
    return Promise.resolve()
  }

  t.plan(3)

  const packages = new Packages(params)
  return packages.delete({packageName: package_name})
})

test('delete package using options namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const package_name = 'package_name'
  const namespace = 'provided'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${namespace}/packages/${package_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'DELETE')
    return Promise.resolve()
  }

  t.plan(3)

  const packages = new Packages(params)
  return packages.delete({packageName: package_name, namespace: 'provided'})
})

test('delete an package without providing any namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const packages = new Packages(params)
  return t.throws(() => { packages.delete({packageName: 'custom'}) }, /Missing namespace/)
})

test('delete an package without providing an package name', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const packages = new Packages(params)
  return t.throws(() => { packages.delete({namespace: 'custom'}) }, /packageName/)
})

test('create a new package using the default namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const package_name = 'package_name'
  const packageBody = {version: '1.0.0', publish: true, annotations: [], parameters: [], binding: {}}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/packages/${package_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'PUT')
    t.deepEqual(req.body, packageBody)
    t.deepEqual(req.qs, {})
    return Promise.resolve()
  }

  t.plan(5)

  const packages = new Packages(params)
  return packages.create({packageName: package_name, package: packageBody})
})

test('create an package using options namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const package_name = 'package_name'
  const namespace = 'provided'
  const packageBody = {version: '1.0.0', publish: true, annotations: [], parameters: [], binding: {}}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${namespace}/packages/${package_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'PUT')
    t.deepEqual(req.body, packageBody)
    t.deepEqual(req.qs, {overwrite: true})
    return Promise.resolve()
  }

  t.plan(5)

  const packages = new Packages(params)
  return packages.create({packageName: package_name, namespace: 'provided', package: packageBody, overwrite: true})
})

test('create an package without providing any namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const packages = new Packages(params)
  return t.throws(() => { packages.create({packageName: 'custom', package: ''}) }, /Missing namespace/)
})

test('create an package without providing an package name', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const packages = new Packages(params)
  return t.throws(() => { packages.create({namespace: 'custom', package: ''}) }, /packageName/)
})

test('update an package', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const package_name = 'package_name'
  const packageBody = {version: '1.0.0', publish: true, annotations: [], parameters: [], binding: {}}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/packages/${package_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'PUT')
    t.deepEqual(req.body, packageBody)
    t.deepEqual(req.qs, {overwrite: true})
    return Promise.resolve()
  }

  t.plan(5)

  const packages = new Packages(params)
  return packages.update({packageName: package_name, package: packageBody})
})

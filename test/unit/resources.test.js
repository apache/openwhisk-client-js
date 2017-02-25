'use strict'

const test = require('ava')
const Resources = require('../../lib/resources')

test('should send HTTP GET request for resource list', t => {
  t.plan(1)
  const resources = new Resources()
  resources.request = (options) => {
    t.is(options.method, 'GET')
    return Promise.resolve()
  }

  return resources.list()
})

test('should send HTTP GET request with id for retrieving resource', t => {
  t.plan(2)
  const resources = new Resources()
  resources.request = (options) => {
    t.is(options.method, 'GET')
    t.is(options.id, '12345')
    return Promise.resolve()
  }

  return resources.get({name: '12345'})
})

test('should send HTTP GET request with string id for retrieving resource', t => {
  t.plan(2)
  const resources = new Resources()
  resources.request = (options) => {
    t.is(options.method, 'GET')
    t.is(options.id, '12345')
    return Promise.resolve()
  }

  return resources.get('12345')
})

test('should send HTTP POST request with id for invoking resource', t => {
  t.plan(2)
  const resources = new Resources()
  resources.request = (options) => {
    t.is(options.method, 'POST')
    t.is(options.id, '12345')
    return Promise.resolve()
  }

  return resources.invoke({name: '12345'})
})

test('should send HTTP POST request with string id for invoking resource', t => {
  t.plan(2)
  const resources = new Resources()
  resources.request = (options) => {
    t.is(options.method, 'POST')
    t.is(options.id, '12345')
    return Promise.resolve()
  }

  return resources.invoke('12345')
})

test('should send HTTP PUT request with id for creating resource', t => {
  t.plan(2)
  const resources = new Resources()
  resources.request = (options) => {
    t.is(options.method, 'PUT')
    t.is(options.id, '12345')
    return Promise.resolve()
  }

  return resources.create({name: '12345'})
})

test('should send HTTP PUT request with string id for creating resource', t => {
  t.plan(2)
  const resources = new Resources()
  resources.request = (options) => {
    t.is(options.method, 'PUT')
    t.is(options.id, '12345')
    return Promise.resolve()
  }

  return resources.create('12345')
})

test('should send HTTP PUT request with id and overwrite for updating resource', t => {
  t.plan(3)
  const resources = new Resources()
  resources.request = (options) => {
    t.is(options.method, 'PUT')
    t.is(options.id, '12345')
    t.true(options.options.overwrite)
    return Promise.resolve()
  }

  return resources.update({name: '12345'})
})

test('should send HTTP PUT request with string id and overwrite for updating resource', t => {
  t.plan(3)
  const resources = new Resources()
  resources.request = (options) => {
    t.is(options.method, 'PUT')
    t.is(options.id, '12345')
    t.true(options.options.overwrite)
    return Promise.resolve()
  }

  return resources.update('12345')
})

test('should send HTTP DELETE request with id for removing resource', t => {
  t.plan(2)
  const resources = new Resources()
  resources.request = (options) => {
    t.is(options.method, 'DELETE')
    t.is(options.id, '12345')
    return Promise.resolve()
  }

  return resources.delete({name: '12345'})
})

test('should send HTTP DELETE request with string id for removing resource', t => {
  t.plan(2)
  const resources = new Resources()
  resources.request = (options) => {
    t.is(options.method, 'DELETE')
    t.is(options.id, '12345')
    return Promise.resolve()
  }

  return resources.delete('12345')
})

test('should send multiple requests for array parameters', t => {
  t.plan(11)
  const resources = new Resources()
  const name = '12345'
  resources.request = (options) => {
    t.is(options.method, 'GET')
    t.is(options.id, '12345')
    return Promise.resolve()
  }

  return resources.operation_with_id('GET', [name, {name}, name, {name}, name])
    .then(result => {
      t.is(result.length, 5)
    })
})

test('should throw errors when missing resource identifier', t => {
  const resources = new Resources()

  t.throws(() => resources.get(), /Missing resource identifier from parameters, supported parameter names: name/)
  t.throws(() => resources.invoke(), /Missing resource identifier from parameters, supported parameter names: name/)
  t.throws(() => resources.create(), /Missing resource identifier from parameters, supported parameter names: name/)
  t.throws(() => resources.update({}), /Missing resource identifier from parameters, supported parameter names: name/)
  t.throws(() => resources.delete(), /Missing resource identifier from parameters, supported parameter names: name/)
})

test('should parse action name from identifier', t => {
  const resources = new Resources()
  const id = '12345'
  const ns_id = '/ns/12345'
  const ns_package_id = '/ns/package/12345'

  t.is(resources.parse_id({name: id}), id)
  t.is(resources.parse_id({name: ns_id}), id)
  t.is(resources.parse_id({name: ns_package_id}), `package/12345`)
  t.throws(() => resources.parse_id({name: '/ns'}), /Invalid resource/)
})

test('should parse namespace from identifier and options', t => {
  const resources = new Resources()
  const name = '12345'
  const ns_name = '/ns/12345'
  const ns_package_name = '/ns/package/12345'

  t.is(resources.parse_namespace({name}), '_')
  t.is(resources.parse_namespace({name, namespace: 'custom'}), 'custom')
  t.is(resources.parse_namespace({name: ns_name}), 'ns')
  t.is(resources.parse_namespace({name: ns_package_name}), 'ns')
  t.is(resources.parse_namespace({name: ns_name, namespace: 'custom'}), 'custom')
})

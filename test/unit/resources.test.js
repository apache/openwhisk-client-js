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

  return resources.get({id: '12345'})
})

test('should send HTTP POST request with id for invoking resource', t => {
  t.plan(2)
  const resources = new Resources()
  resources.request = (options) => {
    t.is(options.method, 'POST')
    t.is(options.id, '12345')
    return Promise.resolve()
  }

  return resources.invoke({id: '12345'})
})

test('should send HTTP PUT request with id for creating resource', t => {
  t.plan(2)
  const resources = new Resources()
  resources.request = (options) => {
    t.is(options.method, 'PUT')
    t.is(options.id, '12345')
    return Promise.resolve()
  }

  return resources.create({id: '12345'})
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

  return resources.update({id: '12345'})
})

test('should send HTTP DELETE request with id for removing resource', t => {
  t.plan(2)
  const resources = new Resources()
  resources.request = (options) => {
    t.is(options.method, 'DELETE')
    t.is(options.id, '12345')
    return Promise.resolve()
  }

  return resources.delete({id: '12345'})
})

test('should throw errors when missing resource identifier', t => {
  const resources = new Resources()

  t.throws(() => resources.get(), /Missing resource identifier from parameters, supported parameter names: id/)
  t.throws(() => resources.invoke(), /Missing resource identifier from parameters, supported parameter names: id/)
  t.throws(() => resources.create(), /Missing resource identifier from parameters, supported parameter names: id/)
  t.throws(() => resources.update({}), /Missing resource identifier from parameters, supported parameter names: id/)
  t.throws(() => resources.delete(), /Missing resource identifier from parameters, supported parameter names: id/)
})

test('should parse action name from identifier', t => {
  const resources = new Resources()
  const id = '12345'
  const ns_id = '/ns/12345'
  const ns_package_id = '/ns/package/12345'

  t.is(resources.parse_id({id}), id)
  t.is(resources.parse_id({id: ns_id}), id)
  t.is(resources.parse_id({id: ns_package_id}), `package/12345`)
  t.throws(() => resources.parse_id({id: '/ns'}), /Invalid resource/)
})

test('should parse namespace from identifier and options', t => {
  const resources = new Resources()
  const id = '12345'
  const ns_id = '/ns/12345'
  const ns_package_id = '/ns/package/12345'

  t.is(resources.parse_namespace({id}), undefined)
  t.is(resources.parse_namespace({id, namespace: 'custom'}), 'custom')
  t.is(resources.parse_namespace({id: ns_id}), 'ns')
  t.is(resources.parse_namespace({id: ns_package_id}), 'ns')
  t.is(resources.parse_namespace({id: ns_id, namespace: 'custom'}), 'ns')
  t.is(resources.parse_namespace({id: ns_package_id, namespace: 'custom'}), 'ns')
})

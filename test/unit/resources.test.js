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

  return resources.get({ name: '12345' })
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

  return resources.invoke({ name: '12345' })
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

  return resources.create({ name: '12345' })
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

  return resources.update({ name: '12345' })
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

  return resources.delete({ name: '12345' })
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

  return resources.operationWithId('GET', [name, { name }, name, { name }, name])
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
  const nsId = '/ns/12345'
  const nsPackageId = '/ns/package/12345'

  t.is(resources.parseId({ name: id }), id)
  t.is(resources.parseId({ name: nsId }), id)
  t.is(resources.parseId({ name: nsPackageId }), `package/12345`)
  t.throws(() => resources.parseId({ name: '/ns' }), /Invalid resource/)
})

test('should parse namespace from identifier and options', t => {
  const resources = new Resources()
  const name = '12345'
  const nsName = '/ns/12345'
  const nsPackageName = '/ns/package/12345'

  t.falsy(resources.parseNamespace({ name }))
  t.is(resources.parseNamespace({ name: nsName }), 'ns')
  t.is(resources.parseNamespace({ name: nsPackageName }), 'ns')
  t.is(resources.parseNamespace({ name, namespace: 'custom' }), 'custom')
  t.is(resources.parseNamespace({ name: nsName, namespace: 'custom' }), 'ns')
  t.is(resources.parseNamespace({ name: nsPackageName, namespace: 'custom' }), 'ns')
})

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
const Packages = require('../../lib/packages')

test('should list all packages without parameters', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const packages = new Packages(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/packages`)
    t.deepEqual(options, { qs: {} })
  }

  return packages.list()
})

test('should list all packages with parameters', t => {
  t.plan(3)
  const client = {}
  const packages = new Packages(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/custom/packages`)
    t.deepEqual(options.qs, { skip: 100, limit: 100 })
  }

  return packages.list({ namespace: 'custom', skip: 100, limit: 100 })
})

test('should list all packages with parameter count', t => {
  t.plan(3)
  const client = {}
  const packages = new Packages(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/custom/packages`)
    t.deepEqual(options.qs, { count: true })
  }

  return packages.list({ namespace: 'custom', count: true })
})

test('should retrieve package from string identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const packages = new Packages(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/packages/12345`)
  }

  return packages.get('12345')
})

test('should retrieve package from identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const packages = new Packages(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/packages/12345`)
  }

  return packages.get({ name: '12345' })
})

test('should retrieve package from packageName identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const packages = new Packages(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/packages/12345`)
  }

  return packages.get({ packageName: '12345' })
})

test('should delete package from string identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const packages = new Packages(client)

  client.request = (method, path, options) => {
    t.is(method, 'DELETE')
    t.is(path, `namespaces/${ns}/packages/12345`)
  }

  return packages.delete('12345')
})

test('should delete package from identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const packages = new Packages(client)

  client.request = (method, path, options) => {
    t.is(method, 'DELETE')
    t.is(path, `namespaces/${ns}/packages/12345`)
  }

  return packages.delete({ name: '12345' })
})

test('should throw error trying to invoke package', t => {
  const packages = new Packages()
  return t.throws(() => packages.invoke(), /Operation \(invoke\) not supported/)
})

test('should create a new package using string id', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const packages = new Packages(client)

  const id = '12345'

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/packages/${id}`)
    t.deepEqual(options.body, {})
  }

  return packages.create(id)
})

test('should create a new package', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const packages = new Packages(client)

  const id = '12345'

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/packages/${id}`)
    t.deepEqual(options.body, {})
  }

  return packages.create({ name: id })
})

test('should create a new package with parameters', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const packages = new Packages(client)
  const pkg = { foo: 'bar' }

  const id = '12345'

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/packages/${id}`)
    t.deepEqual(options.body, pkg)
  }

  return packages.create({ name: id, 'package': pkg })
})

test('create a new package with annotations', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const id = '12345'
  const annotations = {
    foo: 'bar'
  }
  const packages = new Packages(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/packages/${id}`)
    t.deepEqual(options.body, { annotations: [
      { key: 'foo', value: 'bar' }
    ] })
  }

  return packages.create({ name: id, annotations })
})

test('should update an existing package', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const packages = new Packages(client)

  const id = '12345'

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/packages/${id}`)
    t.deepEqual(options.qs, { overwrite: true })
    t.deepEqual(options.body, {})
  }

  return packages.update({ name: id })
})

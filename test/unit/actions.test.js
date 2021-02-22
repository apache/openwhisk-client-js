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
const Actions = require('../../lib/actions')

test('should list all actions without parameters', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/actions`)
    t.deepEqual(options, { qs: {} })
  }

  return actions.list()
})

test('should list all actions with parameters', t => {
  t.plan(3)
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/custom/actions`)
    t.deepEqual(options.qs, { skip: 100, limit: 100 })
  }

  return actions.list({ namespace: 'custom', skip: 100, limit: 100 })
})

test('should list all actions with parameter count', t => {
  t.plan(3)
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/custom/actions`)
    t.deepEqual(options.qs, { count: true })
  }

  return actions.list({ namespace: 'custom', count: true })
})

test('should retrieve action from identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/actions/12345`)
  }

  return actions.get({ name: '12345' })
})

test('should retrieve action from identifier with code query parameter', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)
  const code = {
    code: false
  }

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, code)
  }

  return actions.get({ name: '12345', code: false })
})

test('should retrieve action from string identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/actions/12345`)
  }

  return actions.get('12345')
})

test('should delete action from identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'DELETE')
    t.is(path, `namespaces/${ns}/actions/12345`)
  }

  return actions.delete({ name: '12345' })
})

test('should retrieve actionName from identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/actions/12345`)
  }

  return actions.get({ actionName: '12345' })
})

test('should delete action from string identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'DELETE')
    t.is(path, `namespaces/${ns}/actions/12345`)
  }

  return actions.delete('12345')
})

test('should invoke action', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {})
  }

  return actions.invoke({ name: '12345' })
})

test('should invoke action from string identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/12345`)
  }

  return actions.invoke('12345')
})

test('should invoke fully qualified action', t => {
  t.plan(4)
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/custom/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {})
  }

  return actions.invoke({ name: '/custom/12345' })
})

test('should invoke fully qualified action with package', t => {
  t.plan(4)
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/custom/actions/package/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {})
  }

  return actions.invoke({ name: '/custom/package/12345' })
})

test('should invoke blocking action with body', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, { blocking: true })
    t.deepEqual(options.body, { foo: 'bar' })
  }

  return actions.invoke({ name: '12345', blocking: true, params: { foo: 'bar' } })
})

test('should invoke action to retrieve result', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)
  const result = { hello: 'world' }

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, { blocking: true })
    return Promise.resolve({ response: { result } })
  }

  return actions.invoke({ name: '12345', result: true, blocking: true }).then(_result => {
    t.deepEqual(_result, result)
  })
})

test('should invoke action to retrieve result but request is demoted to async', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)
  const result = { activationId: '123456' }

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, { blocking: true })
    return Promise.resolve(result)
  }

  return actions.invoke({ name: '12345', result: true, blocking: true }).catch(_result => {
    t.deepEqual(_result, result)
  })
})

test('should invoke action to retrieve result without blocking', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)
  const result = { hello: 'world' }

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    return Promise.resolve({ response: { result } })
  }

  return actions.invoke({ name: '12345', result: true }).then(_result => {
    t.deepEqual(_result, { response: { result } })
  })
})

test('should invoke blocking action using actionName', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {})
  }

  return actions.invoke({ actionName: '12345' })
})

test('create a new action', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const action = 'function main() { // main function body};'
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, { exec: { kind: 'nodejs:default', code: action } })
  }

  return actions.create({ name: '12345', action })
})

test('create a new action with custom kind', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const action = 'function main() { // main function body};'
  const kind = 'custom_runtime:version'
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, { exec: { kind, code: action } })
  }

  return actions.create({ name: '12345', action, kind })
})

test('create a new action with custom body', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const code = 'function main() { // main function body};'
  const action = { exec: { kind: 'swift', code: code } }
  const kind = 'custom_runtime:version'
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, action)
  }

  return actions.create({ name: '12345', kind, action })
})

test('create a new action with buffer body', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const action = Buffer.from('some action source contents')
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, { exec: { kind: 'nodejs:default', code: action.toString('base64') } })
  }

  return actions.create({ name: '12345', action })
})

test('create a new action with default parameters', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const action = 'function main() { // main function body};'
  const params = {
    foo: 'bar'
  }
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {
      exec: { kind: 'nodejs:default', code: action },
      parameters: [
        { key: 'foo', value: 'bar' }
      ]
    })
  }

  return actions.create({ name: '12345', action, params })
})

test('create a new action with annotations', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const action = 'function main() { // main function body};'
  const annotations = {
    foo: 'bar'
  }
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, { exec: { kind: 'nodejs:default', code: action },
      annotations: [
        { key: 'foo', value: 'bar' }
      ] })
  }

  return actions.create({ name: '12345', action, annotations })
})

test('update a action with no parameters', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, { overwrite: true })
    t.deepEqual(options.body, { })
  }

  return actions.create({ name: '12345', overwrite: true })
})

test('create a new action with limits', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const action = 'function main() { // main function body};'
  const limits = {
    timeout: 300000
  }
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, { exec: { kind: 'nodejs:default', code: action }, limits: { timeout: 300000 } })
  }

  return actions.create({ name: '12345', action, limits })
})

test('create a new action with concurrency setting', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const action = 'function main() { // main function body};'
  const limits = {
    concurrency: 2
  }
  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, { exec: { kind: 'nodejs:default', code: action }, limits: { concurrency: 2 } })
  }

  return actions.create({ name: '12345', action, limits })
})

test('create an action without providing an action body', t => {
  const actions = new Actions()
  t.throws(() => actions.create({ name: '12345' }), /Missing mandatory action/)
})

test('create a new action with version parameter', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const action = 'function main() { // main function body};'
  const version = '1.0.0'

  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, { exec: { kind: 'nodejs:default', code: action }, version: '1.0.0' })
  }

  return actions.create({ name: '12345', action, version })
})

test('create a new sequence action', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const sequence = ['/ns/action', '/ns/another_action', '/ns/final_action']

  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, { exec: { kind: 'sequence', components: sequence } })
  }

  return actions.create({ name: '12345', sequence })
})

test('create a new sequence action with additional options', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const sequence = ['/ns/action', '/ns/another_action', '/ns/final_action']
  const annotations = {
    foo: 'bar'
  }
  const params = {
    foo: 'bar'
  }
  const limits = {
    timeout: 300000
  }

  const actions = new Actions(client)

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/actions/12345`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, { exec: { kind: 'sequence', components: sequence },
      limits,
      parameters: [
        { key: 'foo', value: 'bar' }
      ],
      annotations: [
        { key: 'foo', value: 'bar' }
      ] })
  }

  return actions.create({ name: '12345', sequence, annotations, params, limits })
})

test('creating sequence action with invalid sequence parameter', t => {
  const client = {}

  const actions = new Actions(client)

  t.throws(() => actions.create({ name: '12345', sequence: 'string' }), /Invalid sequence parameter/)
  t.throws(() => actions.create({ name: '12345', sequence: { foo: 'bar' } }), /Invalid sequence parameter/)
})

test('creating sequence action with empty array', t => {
  const client = {}

  const actions = new Actions(client)

  t.throws(() => actions.create({ name: '12345', sequence: [] }), /Invalid sequence parameter/)
})

test('creating action with both sequence and action parameters', t => {
  const client = {}
  const actions = new Actions(client)

  t.throws(() => actions.create({ name: '12345', action: 'function main() {}', sequence: 'string' }), /Invalid options parameters/)
})

test('should pass through requested User-Agent header', t => {
  t.plan(1)
  const userAgent = 'userAgentShouldPassThroughPlease'
  const client = {}
  const actions = new Actions(client)
  const action = 'function main() { // main function body};'
  const version = '1.0.0'

  client.request = (method, path, options) => {
    t.is(options['User-Agent'], userAgent)
  }

  return actions.create({ name: '12345', action, version, 'User-Agent': userAgent })
})

test('should pass through requested User-Agent header even when __OW_USER_AGENT is set', t => {
  t.plan(1)
  process.env['__OW_USER_AGENT'] = 'my-useragent'

  const userAgent = 'userAgentShouldPassThroughPlease'
  const client = {}
  const actions = new Actions(client)
  const action = 'function main() { // main function body};'
  const version = '1.0.0'

  client.request = (method, path, options) => {
    t.is(options['User-Agent'], userAgent)
    delete process.env['__OW_USER_AGENT']
  }

  return actions.create({ name: '12345', action, version, 'User-Agent': userAgent })
})

test('should pass through exec.image parameter', t => {
  t.plan(1)
  const image = 'openwhisk/action-nodejs-v8:latest'
  const exec = { image: image }
  const client = {}
  const actions = new Actions(client)
  const action = 'function main() { // main function body};'
  const version = '1.0.0'

  client.request = (method, path, options) => {
    t.is(options.body.exec.image, image)
  }

  return actions.create({ name: '12345', action, version, exec, kind: 'blackbox' })
})

test('should pass through exec.image parameter (for all kinds)', t => {
  t.plan(1)
  const image = 'openwhisk/action-nodejs-v8:latest'
  const exec = { image: image }
  const client = {}
  const actions = new Actions(client)
  const action = 'function main() { // main function body};'
  const version = '1.0.0'

  client.request = (method, path, options) => {
    t.is(options.body.exec.image, image)
  }

  return actions.create({ name: '12345', action, version, exec, kind: 'xyz' })
})

test('should not reset kind parameter when passing through exec.image parameter', t => {
  t.plan(1)
  const image = 'openwhisk/action-nodejs-v8:latest'
  const exec = { image: image }
  const client = {}
  const actions = new Actions(client)
  const action = 'function main() { // main function body};'
  const version = '1.0.0'

  client.request = (method, path, options) => {
    t.is(options.body.exec.kind, 'xyz')
  }

  return actions.create({ name: '12345', action, version, exec, kind: 'xyz' })
})

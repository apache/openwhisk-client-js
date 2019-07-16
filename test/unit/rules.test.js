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
const Rules = require('../../lib/rules')

test('should list all rules without parameters', t => {
  t.plan(3)
  const ns = '_'
  const client = { options: {} }
  const rules = new Rules(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/rules`)
    t.deepEqual(options, { qs: {} })
  }

  return rules.list()
})

test('should list all rules with parameters', t => {
  t.plan(3)
  const client = { options: {} }
  const rules = new Rules(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/custom/rules`)
    t.deepEqual(options.qs, { skip: 100, limit: 100 })
  }

  return rules.list({ namespace: 'custom', skip: 100, limit: 100 })
})

test('should list all rules with parameter count', t => {
  t.plan(3)
  const client = { options: {} }
  const rules = new Rules(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/custom/rules`)
    t.deepEqual(options.qs, { count: true })
  }

  return rules.list({ namespace: 'custom', count: true })
})

test('should retrieve rule from identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = { options: {} }
  const rules = new Rules(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/rules/12345`)
  }

  return rules.get({ name: '12345' })
})

test('should retrieve rule from ruleName identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = { options: {} }
  const rules = new Rules(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/rules/12345`)
  }

  return rules.get({ ruleName: '12345' })
})

test('should retrieve rule from string identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = { options: {} }
  const rules = new Rules(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/rules/12345`)
  }

  return rules.get('12345')
})

test('should delete rule from identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = { options: {} }
  const rules = new Rules(client)

  client.request = (method, path, options) => {
    t.is(method, 'DELETE')
    t.is(path, `namespaces/${ns}/rules/12345`)
  }

  return rules.delete({ name: '12345' })
})

test('should delete rule from string identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = { options: {} }
  const rules = new Rules(client)

  client.request = (method, path, options) => {
    t.is(method, 'DELETE')
    t.is(path, `namespaces/${ns}/rules/12345`)
  }

  return rules.delete('12345')
})

test('should throw error trying to invoke rule', t => {
  const rules = new Rules()
  return t.throws(() => rules.invoke(), /Operation \(invoke\) not supported/)
})

test('create a new rule', t => {
  t.plan(4)
  const ns = '_'
  const client = { options: {} }
  const rules = new Rules(client)

  const name = '12345'
  const action = 'some_action'
  const trigger = 'some_trigger'

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/rules/${name}`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, { action: `/_/${action}`, trigger: `/_/${trigger}` })
  }

  return rules.create({ name, action, trigger })
})

test('create a new rule using fully qualified names', t => {
  t.plan(4)
  const ns = '_'
  const client = { options: {} }
  const rules = new Rules(client)

  const name = '12345'
  const action = '/hello/some_action'
  const trigger = '/hello/some_trigger'

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/rules/${name}`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, { action, trigger })
  }

  return rules.create({ name, action, trigger })
})

test('create a new rule with annotations', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const annotations = {
    foo: 'bar'
  }
  const rules = new Rules(client)

  const name = '12345'
  const action = '/hello/some_action'
  const trigger = '/hello/some_trigger'

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/rules/${name}`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, {
      action,
      trigger,
      annotations: [
        { key: 'foo', value: 'bar' }
      ] })
  }

  return rules.create({ name, action, trigger, annotations })
})

test('create a rule without providing a rule name', t => {
  const client = { options: {} }
  const rules = new Rules(client)
  return t.throws(() => {
    rules.create({ action: '', trigger: '' })
  }, /name, ruleName/)
})

test('create a rule without providing an action name', t => {
  const rules = new Rules()
  return t.throws(() => {
    rules.create({ name: '', trigger: '' })
  }, /Missing mandatory action parameter/)
})

test('create a rule without providing a trigger name', t => {
  const rules = new Rules()
  return t.throws(() => {
    rules.create({ name: '', action: '' })
  }, /Missing mandatory trigger parameter/)
})

test('update existing rule', t => {
  t.plan(4)
  const ns = '_'
  const client = { options: {} }
  const rules = new Rules(client)

  const name = '12345'
  const action = 'some_action'
  const trigger = 'some_trigger'

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/rules/${name}`)
    t.deepEqual(options.qs, { overwrite: true })
    t.deepEqual(options.body, { action: `/_/${action}`, trigger: `/_/${trigger}` })
  }

  return rules.update({ name, action, trigger })
})

test('should enable rule', t => {
  t.plan(3)
  const ns = '_'
  const client = { options: {} }
  const rules = new Rules(client)

  const name = '12345'

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/rules/${name}`)
    t.deepEqual(options.body, { status: 'active' })
  }

  return rules.enable({ name })
})

test('should disable rule', t => {
  t.plan(3)
  const ns = '_'
  const client = { options: {} }
  const rules = new Rules(client)

  const name = '12345'

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/rules/${name}`)
    t.deepEqual(options.body, { status: 'inactive' })
  }

  return rules.disable({ name })
})

test('should parse correct namespace for actions names with no other namespaces', t => {
  const client = { options: {} }
  const rules = new Rules(client)

  t.is(rules.convertToFqn('simple'), '/_/simple')
  t.is(rules.convertToFqn('simple', 'a'), '/a/simple')
  t.is(rules.convertToFqn('/a/simple'), '/a/simple')
  t.is(rules.convertToFqn('/a/simple', 'b'), '/a/simple')
})

test('should parse correct namespace for actions names with global namespace', t => {
  const client = { options: { namespace: 'global' } }
  const rules = new Rules(client)

  t.is(rules.convertToFqn('simple'), '/global/simple')
  t.is(rules.convertToFqn('simple', 'a'), '/a/simple')
  t.is(rules.convertToFqn('/a/simple'), '/a/simple')
  t.is(rules.convertToFqn('/a/simple', 'b'), '/a/simple')
})

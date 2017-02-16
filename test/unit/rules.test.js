'use strict'

const test = require('ava')
const Rules = require('../../lib/rules')

test('should list all rules without parameters', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const rules = new Rules(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/rules`)
    t.deepEqual(options, {qs: {}})
  }

  return rules.list()
})

test('should list all rules with parameters', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const rules = new Rules(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/custom/rules`)
    t.deepEqual(options.qs, {skip: 100, limit: 100})
  }

  return rules.list({namespace: 'custom', skip: 100, limit: 100})
})

test('should retrieve rule from identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const rules = new Rules(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/rules/12345`)
  }

  return rules.get({id: '12345'})
})

test('should retrieve rule from ruleName identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const rules = new Rules(client)

  client.request = (method, path, options) => {
    t.is(method, 'GET')
    t.is(path, `namespaces/${ns}/rules/12345`)
  }

  return rules.get({ruleName: '12345'})
})

test('should delete rule from identifier', t => {
  t.plan(2)
  const ns = '_'
  const client = {}
  const rules = new Rules(client)

  client.request = (method, path, options) => {
    t.is(method, 'DELETE')
    t.is(path, `namespaces/${ns}/rules/12345`)
  }

  return rules.delete({id: '12345'})
})

test('should throw error trying to invoke rule', t => {
  const rules = new Rules()
  return t.throws(() => rules.invoke(), /Operation \(invoke\) not supported/)
})

test('create a new rule', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const rules = new Rules(client)

  const id = '12345'
  const action = 'some_action'
  const trigger = 'some_trigger'

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/rules/${id}`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, { action: `/_/${action}`, trigger: `/_/${trigger}` })
  }

  return rules.create({id, action, trigger})
})

test('create a new rule using fully qualified names', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const rules = new Rules(client)

  const id = '12345'
  const action = '/hello/some_action'
  const trigger = '/hello/some_trigger'

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/rules/${id}`)
    t.deepEqual(options.qs, {})
    t.deepEqual(options.body, { action, trigger })
  }

  return rules.create({id, action, trigger})
})

test('create a rule without providing a rule name', t => {
  const rules = new Rules()
  return t.throws(() => { rules.create({action: '', trigger: ''}) }, /id, ruleName/)
})

test('create a rule without providing an action name', t => {
  const rules = new Rules()
  return t.throws(() => { rules.create({id: '', trigger: ''}) }, /Missing mandatory action parameter/)
})

test('create a rule without providing a trigger name', t => {
  const rules = new Rules()
  return t.throws(() => { rules.create({id: '', action: ''}) }, /Missing mandatory trigger parameter/)
})

test('update existing rule', t => {
  t.plan(4)
  const ns = '_'
  const client = {}
  const rules = new Rules(client)

  const id = '12345'
  const action = 'some_action'
  const trigger = 'some_trigger'

  client.request = (method, path, options) => {
    t.is(method, 'PUT')
    t.is(path, `namespaces/${ns}/rules/${id}`)
    t.deepEqual(options.qs, {overwrite: true})
    t.deepEqual(options.body, { action: `/_/${action}`, trigger: `/_/${trigger}` })
  }

  return rules.update({id, action, trigger})
})

test('should enable rule', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const rules = new Rules(client)

  const id = '12345'

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/rules/${id}`)
    t.deepEqual(options.body, {status: 'active'})
  }

  return rules.enable({id})
})

test('should disable rule', t => {
  t.plan(3)
  const ns = '_'
  const client = {}
  const rules = new Rules(client)

  const id = '12345'

  client.request = (method, path, options) => {
    t.is(method, 'POST')
    t.is(path, `namespaces/${ns}/rules/${id}`)
    t.deepEqual(options.body, {status: 'inactive'})
  }

  return rules.disable({id})
})

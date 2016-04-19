'use strict'

const test = require('ava')
const Rules = require('../../lib/rules.js')

const API_KEY = process.env.OW_API_KEY
const API_URL = process.env.OW_API_URL
const NAMESPACE = process.env.OW_NAMESPACE

if (!API_KEY) {
  throw new Error('Missing OW_API_KEY environment parameter')
}

if (!API_URL) {
  throw new Error('Missing OW_API_URL environment parameter')
}

if (!NAMESPACE) {
  throw new Error('Missing OW_NAMESPACE environment parameter')
}

test('list all rules using default namespace', t => {
  const params = {api: API_URL, api_key: API_KEY, namespace: NAMESPACE}

  const rules = new Rules(params)
  return rules.list().then(result => {
    t.true(Array.isArray(result))
    result.forEach(rule => {
      t.is(rule.namespace, NAMESPACE)
    })
    t.pass()
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

test('list all rules using options namespace', t => {
  const params = {api: API_URL, api_key: API_KEY}

  const rules = new Rules(params)
  return rules.list({namespace: NAMESPACE}).then(result => {
    t.true(Array.isArray(result))
    result.forEach(rule => {
      t.is(rule.namespace, NAMESPACE)
    })
    t.pass()
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

test('create, get and delete a rule', t => {
  const params = {api: API_URL, api_key: API_KEY, namespace: NAMESPACE}

  const errors = err => {
    console.log(err)
    t.fail()
  }

  const rules = new Rules(params)
  return rules.create({ruleName: 'random_rule_test', action: 'hello', trigger: 'sample'}).then(result => {
    t.is(result.name, 'random_rule_test')
    t.is(result.namespace, NAMESPACE)
    t.is(result.action, 'hello')
    t.is(result.trigger, 'sample')
    return rules.get({ruleName: result.name}).then(rule_result => {
      t.is(rule_result.name, result.name)
      t.is(rule_result.namespace, NAMESPACE)
      t.pass()
      return rules.delete({ruleName: 'random_rule_test'}).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

test('create and update a rule', t => {
  const params = {api: API_URL, api_key: API_KEY, namespace: NAMESPACE}

  const errors = err => {
    console.log(err)
    t.fail()
  }

  const rules = new Rules(params)
  return rules.create({ruleName: 'random_update_test', action: 'hello', trigger: 'sample'}).then(result => {
    t.is(result.name, 'random_update_test')
    t.is(result.namespace, NAMESPACE)
    t.is(result.action, 'hello')
    t.is(result.trigger, 'sample')
    return rules.update({ruleName: 'random_update_test', action: 'tests', trigger: 'sample'}).then(update_result => {
      t.is(update_result.action, 'tests')
      t.pass()
      return rules.delete({ruleName: 'random_update_test'}).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

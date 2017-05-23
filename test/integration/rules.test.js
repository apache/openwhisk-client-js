'use strict'

const test = require('ava')
const Rules = require('../../lib/rules.js')
const Triggers = require('../../lib/triggers.js')
const Client = require('../../lib/client.js')

const envParams = ['API_KEY', 'API_HOST', 'NAMESPACE']

// check that mandatory configuration properties are available
envParams.forEach(key => {
  const param = `__OW_${key}` 
  if (!process.env.hasOwnProperty(param)) {
    throw new Error(`Missing ${param} environment parameter`)
  }
})

const NAMESPACE = process.env.__OW_NAMESPACE

test('list all rules using default namespace', t => {
  const rules = new Rules(new Client())
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
  const rules = new Rules(new Client())
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

// Running update tests conconcurrently leads to resource conflict errors.
test.serial('create, get and delete a rule', t => {
  const errors = err => {
    console.log(err)
    t.fail()
  }

  const rules = new Rules(new Client())
  const triggers = new Triggers(new Client())
  return triggers.create({triggerName: 'sample_rule_trigger'}).then(() => {
    return rules.create({ruleName: 'random_rule_test', action: `/${NAMESPACE}/hello`, trigger: `/${NAMESPACE}/sample_rule_trigger`}).then(result => {
      t.is(result.name, 'random_rule_test')
      t.is(result.namespace, NAMESPACE)
      t.deepEqual(result.action, {path: NAMESPACE, name: 'hello'})
      t.deepEqual(result.trigger, {path: NAMESPACE, name: 'sample_rule_trigger'})
      return rules.get({ruleName: result.name}).then(rule_result => {
        t.is(rule_result.name, result.name)
        t.is(rule_result.namespace, NAMESPACE)
        t.pass()
        return rules.disable({ruleName: 'random_rule_test'})
          .then(() => rules.delete({ruleName: 'random_rule_test'}))
          .then(() => triggers.delete({triggerName: 'sample_rule_trigger'}))
      })
    })
  }).catch(errors)
})

test.serial('create and update a rule', t => {
  const errors = err => {
    console.log(err)
    t.fail()
  }

  const rules = new Rules(new Client())
  const triggers = new Triggers(new Client())
  return triggers.create({triggerName: 'sample_rule_trigger'}).then(() => {
    return rules.create({ruleName: 'random_update_test', action: `/${NAMESPACE}/hello`, trigger: `/${NAMESPACE}/sample_rule_trigger`}).then(result => {
      t.is(result.name, 'random_update_test')
      t.is(result.namespace, NAMESPACE)
      t.deepEqual(result.action, {path: NAMESPACE, name: 'hello'})
      t.deepEqual(result.trigger, {path: NAMESPACE, name: 'sample_rule_trigger'})
      return rules.disable({ruleName: 'random_update_test'}).then(() => {
        return rules.update({ruleName: 'random_update_test', action: 'tests', trigger: 'sample_rule_trigger'}).then(update_result => {
          t.deepEqual(update_result.action, {path: NAMESPACE, name: 'tests'})
          t.pass()
          return rules.delete({ruleName: 'random_update_test'})
            .then(() => triggers.delete({triggerName: 'sample_rule_trigger'}))
            .catch(errors)
        })
      })
    }).catch(errors)
  }).catch(errors)
})

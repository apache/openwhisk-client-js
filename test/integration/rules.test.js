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
const Rules = require('../../lib/rules.js')
const Triggers = require('../../lib/triggers.js')
const Actions = require('../../lib/actions.js')
const Client = require('../../lib/client.js')
const Utils = require('./utils.js')
const options = Utils.autoOptions()

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
  const rules = new Rules(new Client(options))
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
  const rules = new Rules(new Client(options))
  return rules.list({ namespace: NAMESPACE }).then(result => {
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

test('get a non-existing rule, expecting 404', async t => {
  const rules = new Rules(new Client(options))
  await rules.get({ name: 'glorfindel' }).catch(err => {
    t.is(err.statusCode, 404)
  })
})

// Running update tests concurrently leads to resource conflict errors.
test.serial('create, get and delete a rule', t => {
  const errors = err => {
    console.log(err)
    t.fail()
  }

  const rules = new Rules(new Client(options))
  const triggers = new Triggers(new Client(options))
  const actions = new Actions(new Client(options))
  return actions.create({ actionName: 'hello', action: 'function main() {return {payload:"Hello world"}}' }).then(() => {
    return triggers.create({ triggerName: 'sample_rule_trigger' }).then(() => {
      return rules.create({
        ruleName: 'random_rule_test',
        action: `/${NAMESPACE}/hello`,
        trigger: `/${NAMESPACE}/sample_rule_trigger`
      }).then(result => {
        t.is(result.name, 'random_rule_test')
        t.is(result.namespace, NAMESPACE)
        t.deepEqual(result.action, { path: NAMESPACE, name: 'hello' })
        t.deepEqual(result.trigger, { path: NAMESPACE, name: 'sample_rule_trigger' })
        return rules.get({ ruleName: result.name }).then(ruleResult => {
          t.is(ruleResult.name, result.name)
          t.is(ruleResult.namespace, NAMESPACE)
          t.pass()
          return rules.disable({ ruleName: 'random_rule_test' })
            .then(() => rules.delete({ ruleName: 'random_rule_test' }))
            .then(() => triggers.delete({ triggerName: 'sample_rule_trigger' }))
            .then(() => actions.delete({ actionName: 'hello' }))
        })
      })
    })
  }).catch(errors)
})

test.serial('create and update a rule', t => {
  const errors = err => {
    console.log(err)
    t.fail()
  }

  const rules = new Rules(new Client(options))
  const triggers = new Triggers(new Client(options))
  const actions = new Actions(new Client(options))
  return actions.create({ actionName: 'hello', action: 'function main() {return {payload:"Hello world"}}' }).then(() => {
    return actions.create({
      actionName: 'tests',
      action: 'function main() {return {payload:"Hello world"}}'
    }).then(() => {
      return triggers.create({ triggerName: 'sample_rule_trigger' }).then(() => {
        return rules.create({
          ruleName: 'random_update_test',
          action: `/${NAMESPACE}/hello`,
          trigger: `/${NAMESPACE}/sample_rule_trigger`
        }).then(result => {
          t.is(result.name, 'random_update_test')
          t.is(result.namespace, NAMESPACE)
          t.deepEqual(result.action, { path: NAMESPACE, name: 'hello' })
          t.deepEqual(result.trigger, { path: NAMESPACE, name: 'sample_rule_trigger' })
          return rules.disable({ ruleName: 'random_update_test' }).then(() => {
            return rules.update({
              ruleName: 'random_update_test',
              action: 'tests',
              trigger: 'sample_rule_trigger'
            }).then(updateResult => {
              t.deepEqual(updateResult.action, { path: NAMESPACE, name: 'tests' })
              t.pass()
              return rules.delete({ ruleName: 'random_update_test' })
                .then(() => triggers.delete({ triggerName: 'sample_rule_trigger' }))
                .then(() => actions.delete({ actionName: 'hello' }))
                .then(() => actions.delete({ actionName: 'tests' }))
                .catch(errors)
            })
          })
        }).catch(errors)
      })
    })
  }).catch(errors)
})

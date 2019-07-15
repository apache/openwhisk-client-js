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
const Triggers = require('../../lib/triggers.js')
const Rules = require('../../lib/rules.js')
const Client = require('../../lib/client.js')
const Utils = require('./utils.js')

const envParams = ['API_KEY', 'API_HOST', 'NAMESPACE']
const options = Utils.autoOptions()

// check that mandatory configuration properties are available
envParams.forEach(key => {
  const param = `__OW_${key}`
  if (!process.env.hasOwnProperty(param)) {
    throw new Error(`Missing ${param} environment parameter`)
  }
})

const NAMESPACE = process.env.__OW_NAMESPACE

test('list all triggers using default namespace', t => {
  const triggers = new Triggers(new Client(options))
  return triggers.list().then(result => {
    t.true(Array.isArray(result))
    result.forEach(trigger => {
      t.is(trigger.namespace, NAMESPACE)
    })
    t.pass()
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

test('list all triggers using options namespace', t => {
  const triggers = new Triggers(new Client(options))
  return triggers.list({ namespace: NAMESPACE }).then(result => {
    t.true(Array.isArray(result))
    result.forEach(trigger => {
      t.is(trigger.namespace, NAMESPACE)
    })
    t.pass()
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

test('get a non-existing trigger, expecting 404', async t => {
  const triggers = new Triggers(new Client(options))
  await triggers.get({ name: 'glorfindel' }).catch(err => {
    t.is(err.statusCode, 404)
  })
})

test('create, get and delete an trigger', t => {
  const errors = err => {
    console.log(err)
    t.fail()
  }

  const triggers = new Triggers(new Client(options))
  return triggers.create({ triggerName: 'random_trigger_test' }).then(result => {
    t.is(result.name, 'random_trigger_test')
    t.is(result.namespace, NAMESPACE)
    t.deepEqual(result.annotations, [])
    t.is(result.version, '0.0.1')
    t.deepEqual(result.limits, {})
    t.pass()
    return triggers.get({ triggerName: result.name }).then(triggerResult => {
      t.is(triggerResult.name, result.name)
      t.is(triggerResult.namespace, NAMESPACE)
      t.pass()
      return triggers.delete({ triggerName: result.name }).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

test('create and update an trigger', t => {
  const errors = err => {
    console.log(err)
    t.fail()
  }

  const triggers = new Triggers(new Client(options))
  return triggers.create({ triggerName: 'random_create_update_test' }).then(result => {
    t.is(result.name, 'random_create_update_test')
    t.is(result.namespace, NAMESPACE)
    t.deepEqual(result.annotations, [])
    t.is(result.version, '0.0.1')
    t.deepEqual(result.limits, {})
    return triggers.update({ triggerName: 'random_create_update_test' }).then(updateResult => {
      t.is(updateResult.version, '0.0.2')
      t.pass()
      return triggers.delete({ triggerName: 'random_create_update_test' }).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

test('fire a trigger', t => {
  const errors = err => {
    console.log(err)
    t.fail()
  }

  const triggers = new Triggers(new Client(options))
  const rules = new Rules(new Client(options))

  return triggers.create({ triggerName: 'random_fire_test' }).then(() => {
    return rules.create({ ruleName: 'echo_rule', action: `/whisk.system/utils/echo`, trigger: `/${NAMESPACE}/random_fire_test` }).then(() => {
      return triggers.invoke({ triggerName: 'random_fire_test' }).then(updateResult => {
        t.true(updateResult.hasOwnProperty('activationId'))
        t.pass()
        return triggers.delete({ triggerName: 'random_fire_test' })
          .then(() => rules.delete({ ruleName: 'echo_rule' }))
      }).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

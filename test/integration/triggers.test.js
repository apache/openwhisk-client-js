// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

'use strict'

const test = require('ava')
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

test('list all triggers using default namespace', t => {
  const triggers = new Triggers(new Client())
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
  const triggers = new Triggers(new Client())
  return triggers.list({namespace: NAMESPACE}).then(result => {
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

test('create, get and delete an trigger', t => {
  const errors = err => {
    console.log(err)
    t.fail()
  }

  const triggers = new Triggers(new Client())
  return triggers.create({triggerName: 'random_trigger_test'}).then(result => {
    t.is(result.name, 'random_trigger_test')
    t.is(result.namespace, NAMESPACE)
    t.deepEqual(result.annotations, [])
    t.is(result.version, '0.0.1')
    t.deepEqual(result.limits, {})
    t.pass()
    return triggers.get({triggerName: result.name}).then(trigger_result => {
      t.is(trigger_result.name, result.name)
      t.is(trigger_result.namespace, NAMESPACE)
      t.pass()
      return triggers.delete({triggerName: result.name}).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

test('create and update an trigger', t => {
  const errors = err => {
    console.log(err)
    t.fail()
  }

  const triggers = new Triggers(new Client())
  return triggers.create({triggerName: 'random_create_update_test'}).then(result => {
    t.is(result.name, 'random_create_update_test')
    t.is(result.namespace, NAMESPACE)
    t.deepEqual(result.annotations, [])
    t.is(result.version, '0.0.1')
    t.deepEqual(result.limits, {})
    return triggers.update({triggerName: 'random_create_update_test'}).then(update_result => {
      t.is(update_result.version, '0.0.2')
      t.pass()
      return triggers.delete({triggerName: 'random_create_update_test'}).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

test('fire a trigger', t => {
  const errors = err => {
    console.log(err)
    t.fail()
  }

  const triggers = new Triggers(new Client())
  return triggers.create({triggerName: 'random_fire_test'}).then(result => {
    return triggers.invoke({triggerName: 'random_fire_test'}).then(update_result => {
      t.true(update_result.hasOwnProperty('activationId'))
      t.pass()
      return triggers.delete({triggerName: 'random_fire_test'}).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

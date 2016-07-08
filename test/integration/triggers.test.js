'use strict'

const test = require('ava')
const Triggers = require('../../lib/triggers.js')

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

test('list all triggers using default namespace', t => {
  const params = {api: API_URL, api_key: API_KEY, namespace: NAMESPACE}

  const triggers = new Triggers(params)
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
  const params = {api: API_URL, api_key: API_KEY}

  const triggers = new Triggers(params)
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
  const params = {api: API_URL, api_key: API_KEY, namespace: NAMESPACE}

  const errors = err => {
    console.log(err)
    t.fail()
  }

  const triggers = new Triggers(params)
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
  const params = {api: API_URL, api_key: API_KEY, namespace: NAMESPACE}

  const errors = err => {
    console.log(err)
    t.fail()
  }

  const triggers = new Triggers(params)
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
  const params = {api: API_URL, api_key: API_KEY, namespace: NAMESPACE}

  const errors = err => {
    console.log(err)
    t.fail()
  }

  const triggers = new Triggers(params)
  return triggers.create({triggerName: 'random_fire_test'}).then(result => {
    return triggers.invoke({triggerName: 'random_fire_test'}).then(update_result => {
      t.true(update_result.hasOwnProperty('activationId'))
      t.pass()
      return triggers.delete({triggerName: 'random_fire_test'}).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

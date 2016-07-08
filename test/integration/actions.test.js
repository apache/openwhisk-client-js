'use strict'

const test = require('ava')
const Actions = require('../../lib/actions.js')

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

test('list all actions using default namespace', t => {
  const params = {api: API_URL, api_key: API_KEY, namespace: NAMESPACE}

  const actions = new Actions(params)
  return actions.list().then(result => {
    t.true(Array.isArray(result))
    result.forEach(action => {
      t.is(action.namespace, NAMESPACE)
    })
    t.pass()
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

test('list all actions using options namespace', t => {
  const params = {api: API_URL, api_key: API_KEY}

  const actions = new Actions(params)
  return actions.list({namespace: NAMESPACE}).then(result => {
    t.true(Array.isArray(result))
    result.forEach(action => {
      t.is(action.namespace, NAMESPACE)
    })
    t.pass()
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

test('create, get and delete an action', t => {
  const params = {api: API_URL, api_key: API_KEY, namespace: NAMESPACE}

  const errors = err => {
    console.log(err)
    t.fail()
  }

  const actions = new Actions(params)
  return actions.create({actionName: 'random_action_test', action: 'function main() {return {payload:"testing"}}'}).then(result => {
    t.is(result.name, 'random_action_test')
    t.is(result.namespace, NAMESPACE)
    t.is(result.exec.kind, 'nodejs')
    t.is(result.exec.code, 'function main() {return {payload:"testing"}}')
    return actions.get({actionName: 'random_action_test'}).then(action_result => {
      t.is(action_result.name, 'random_action_test')
      t.is(action_result.namespace, NAMESPACE)
      t.pass()
      return actions.delete({actionName: 'random_action_test'}).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

test('create and update an action', t => {
  const params = {api: API_URL, api_key: API_KEY, namespace: NAMESPACE}

  const errors = err => {
    console.log(err)
    t.fail()
  }

  const actions = new Actions(params)
  return actions.create({actionName: 'random_update_tested', action: 'function main() {return {payload:"testing"}}'}).then(result => {
    t.is(result.name, 'random_update_tested')
    t.is(result.namespace, NAMESPACE)
    t.is(result.exec.kind, 'nodejs')
    t.is(result.exec.code, 'function main() {return {payload:"testing"}}')
    return actions.update({actionName: 'random_update_tested', action: 'update test'}).then(update_result => {
      t.is(update_result.exec.code, 'update test')
      t.pass()
      return actions.delete({actionName: 'random_update_tested'}).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

test('create, invoke and remove action', t => {
  const params = {api: API_URL, api_key: API_KEY, namespace: NAMESPACE}

  const errors = err => {
    console.log(err)
    t.fail()
  }

  const actions = new Actions(params)
  return actions.create({actionName: 'random_invoke_test', action: 'function main(params) {return params}'}).then(result => {
    return actions.invoke({actionName: 'random_invoke_test', params: {hello: 'world'}, blocking: true}).then(invoke_result => {
      t.deepEqual(invoke_result.response.result, {hello: 'world'})
      t.true(invoke_result.response.success)
      t.pass()
      return actions.delete({actionName: 'random_invoke_test'}).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

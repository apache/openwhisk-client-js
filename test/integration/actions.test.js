'use strict'

const test = require('ava')
const Actions = require('../../lib/actions.js')
const Client = require('../../lib/client.js')
const JSZip = require('jszip')

const API_KEY = process.env.OW_API_KEY
const API_URL = process.env.OW_API_URL
const NAMESPACE = process.env['__OW_NAMESPACE']

if (!API_KEY) {
  throw new Error('Missing OW_API_KEY environment parameter')
}

if (!API_URL) {
  throw new Error('Missing OW_API_URL environment parameter')
}

if (!NAMESPACE) {
  throw new Error('Missing __OW_NAMESPACE environment parameter')
}

test('list all actions using default namespace', t => {
  const params = {api: API_URL, api_key: API_KEY}

  const actions = new Actions(new Client(params))
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

  const actions = new Actions(new Client(params))
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

  const actions = new Actions(new Client(params))
  return actions.create({actionName: 'random_action_test', action: 'function main() {return {payload:"testing"}}'}).then(result => {
    t.is(result.name, 'random_action_test')
    t.is(result.namespace, NAMESPACE)
    t.is(result.exec.kind, 'nodejs:6')
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

  const actions = new Actions(new Client(params))
  return actions.create({actionName: 'random_update_tested', action: 'function main() {return {payload:"testing"}}'}).then(result => {
    t.is(result.name, 'random_update_tested')
    t.is(result.namespace, NAMESPACE)
    t.is(result.exec.kind, 'nodejs:6')
    t.is(result.exec.code, 'function main() {return {payload:"testing"}}')
    return actions.update({actionName: 'random_update_tested', action: 'update test'}).then(update_result => {
      t.is(update_result.exec.code, 'update test')
      t.pass()
      return actions.delete({actionName: 'random_update_tested'}).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

test('create, get and delete with parameters an action', t => {
  const params = {api: API_URL, api_key: API_KEY, namespace: NAMESPACE}

  const errors = err => {
    console.log(err)
    t.fail()
  }

  const actions = new Actions(new Client(params))
  return actions.create({name: 'random_action_params_test', params: { hello: 'world' }, action: 'function main() {return {payload:"testing"}}'}).then(result => {
    t.is(result.name, 'random_action_params_test')
    t.is(result.namespace, NAMESPACE)
    t.deepEqual(result.parameters, [{key: 'hello', value: 'world'}])
    t.is(result.exec.kind, 'nodejs:6')
    t.is(result.exec.code, 'function main() {return {payload:"testing"}}')
    return actions.update({actionName: 'random_action_params_test', params: { foo: 'bar' }, action: 'update test'}).then(update_result => {
      t.is(update_result.name, 'random_action_params_test')
      t.is(update_result.namespace, NAMESPACE)
      t.deepEqual(update_result.parameters, [{key: 'foo', value: 'bar'}])
      t.pass()
      return actions.delete({name: 'random_action_params_test'}).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

test('invoke action with fully-qualified name', t => {
  const params = {api: API_URL, api_key: API_KEY, namespace: NAMESPACE}

  const errors = err => {
    console.log(err)
    console.dir(err)
    t.fail()
  }

  const actions = new Actions(new Client(params))
  return actions.invoke({actionName: '/whisk.system/utils/sort', blocking: true}).then(invoke_result => {
    t.true(invoke_result.response.success)
    t.pass()
  }).catch(errors)
})

test('create, invoke and remove package action', t => {
  const params = {api: API_URL, api_key: API_KEY, namespace: NAMESPACE}

  const errors = err => {
    console.log(err)
    console.dir(err)
    t.fail()
  }

  const zip = new JSZip()
  zip.file('package.json', JSON.stringify({main: 'index.js'}))
  zip.file('index.js', 'function main(params) {return params};\nexports.main = main;')

  return zip.generateAsync({type: 'nodebuffer'}).then(content => {
    const actions = new Actions(new Client(params))
    return actions.create({actionName: 'random_package_action_test', action: content}).then(result => {
      return actions.invoke({actionName: 'random_package_action_test', params: {hello: 'world'}, blocking: true}).then(invoke_result => {
        t.deepEqual(invoke_result.response.result, {hello: 'world'})
        t.true(invoke_result.response.success)
        t.pass()
        return actions.delete({actionName: 'random_package_action_test'}).catch(errors)
      })
    })
  }).catch(errors)
})

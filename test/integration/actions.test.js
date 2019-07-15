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
const Actions = require('../../lib/actions.js')
const Client = require('../../lib/client.js')
const JSZip = require('jszip')
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

test('list all actions using default namespace', t => {
  const actions = new Actions(new Client(options))
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
  const actions = new Actions(new Client(options))
  return actions.list({ namespace: NAMESPACE }).then(result => {
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

test('get a non-existing action, expecting 404', async t => {
  const actions = new Actions(new Client(options))
  await actions.get({ name: 'glorfindel' }).catch(err => {
    t.is(err.statusCode, 404)
  })
})

test('delete a non-existing action, expecting 404', async t => {
  const actions = new Actions(new Client(options))
  await actions.delete({ name: 'glorfindel' }).catch(err => {
    t.is(err.statusCode, 404)
  })
})

test('create with an existing action, expecting 409', async t => {
  const actions = new Actions(new Client(options))
  await actions.create({ name: 'glorfindel2', action: 'x=>x' })
    .then(() => actions.create({ name: 'glorfindel2', action: 'x=>x' }))
    .catch(err => {
      t.is(err.statusCode, 409)
    })
})

test('create, get and delete an action', t => {
  const errors = err => {
    console.log(err)
    t.fail()
  }

  const actions = new Actions(new Client(options))
  return actions.create({
    actionName: 'random_action_test',
    action: 'function main() {return {payload:"testing"}}'
  }).then(result => {
    t.is(result.name, 'random_action_test')
    t.is(result.namespace, NAMESPACE)
    t.true(result.exec.kind.startsWith('nodejs'))
    t.is(result.exec.code, 'function main() {return {payload:"testing"}}')
    return actions.get({ actionName: 'random_action_test' }).then(actionResult => {
      t.is(actionResult.name, 'random_action_test')
      t.is(actionResult.namespace, NAMESPACE)
      t.pass()
      return actions.delete({ actionName: 'random_action_test' }).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

test('create and update an action', t => {
  const errors = err => {
    console.log(err)
    t.fail()
  }

  const actions = new Actions(new Client(options))
  return actions.create({
    actionName: 'random_update_tested',
    action: 'function main() {return {payload:"testing"}}'
  }).then(result => {
    t.is(result.name, 'random_update_tested')
    t.is(result.namespace, NAMESPACE)
    t.true(result.exec.kind.startsWith('nodejs'))
    t.is(result.exec.code, 'function main() {return {payload:"testing"}}')
    return actions.update({ actionName: 'random_update_tested', action: 'update test' }).then(updateResult => {
      t.is(updateResult.exec.code, 'update test')
      t.pass()
      return actions.delete({ actionName: 'random_update_tested' }).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

test('create, get and delete with parameters an action', t => {
  const errors = err => {
    console.log(err)
    t.fail()
  }

  const actions = new Actions(new Client(options))
  return actions.create({
    name: 'random_action_params_test',
    params: { hello: 'world' },
    action: 'function main() {return {payload:"testing"}}'
  }).then(result => {
    t.is(result.name, 'random_action_params_test')
    t.is(result.namespace, NAMESPACE)
    t.deepEqual(result.parameters, [{ key: 'hello', value: 'world' }])
    t.true(result.exec.kind.startsWith('nodejs'))
    t.is(result.exec.code, 'function main() {return {payload:"testing"}}')
    return actions.update({
      actionName: 'random_action_params_test',
      params: { foo: 'bar' },
      action: 'update test'
    }).then(updateResult => {
      t.is(updateResult.name, 'random_action_params_test')
      t.is(updateResult.namespace, NAMESPACE)
      t.deepEqual(updateResult.parameters, [{ key: 'foo', value: 'bar' }])
      t.pass()
      return actions.delete({ name: 'random_action_params_test' }).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

test('get an action with and without its code', t => {
  const errors = err => {
    console.log(err)
    t.fail()
  }

  const actions = new Actions(new Client(options))
  return actions.create({ actionName: 'random_action_get_test', action: 'function main() {return {payload:"testing"}}' }).then(result => {
    t.is(result.name, 'random_action_get_test')
    t.is(result.namespace, NAMESPACE)
    t.true(result.exec.kind.startsWith('nodejs'))
    t.is(result.exec.code, 'function main() {return {payload:"testing"}}')
    return actions.get({ actionName: 'random_action_get_test', code: false }).then(actionResult => {
      t.is(actionResult.name, 'random_action_get_test')
      t.is(actionResult.namespace, NAMESPACE)
      t.is(actionResult.exec.code, undefined)
      return actions.get({ actionName: 'random_action_get_test', code: true }).then(actionResult => {
        t.is(actionResult.name, 'random_action_get_test')
        t.is(actionResult.namespace, NAMESPACE)
        t.is(actionResult.exec.code, 'function main() {return {payload:"testing"}}')
        return actions.get({ actionName: 'random_action_get_test' }).then(actionTesult => {
          t.is(actionTesult.name, 'random_action_get_test')
          t.is(actionTesult.namespace, NAMESPACE)
          t.is(actionTesult.exec.code, 'function main() {return {payload:"testing"}}')
          t.pass()
          return actions.delete({ actionName: 'random_action_get_test' }).catch(errors)
        }).catch(errors)
      }).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

test('invoke action with fully-qualified name', t => {
  const errors = err => {
    console.log(err)
    console.dir(err)
    t.fail()
  }

  const actions = new Actions(new Client(options))
  return actions.invoke({ actionName: '/whisk.system/utils/sort', blocking: true }).then(invokeResult => {
    t.true(invokeResult.response.success)
    t.pass()
  }).catch(errors)
})

test('create, invoke and remove package action', t => {
  const errors = err => {
    console.log(err)
    console.dir(err)
    t.fail()
  }

  const zip = new JSZip()
  zip.file('package.json', JSON.stringify({ main: 'index.js' }))
  zip.file('index.js', 'function main(params) {return params};\nexports.main = main;')

  return zip.generateAsync({ type: 'nodebuffer' }).then(content => {
    const actions = new Actions(new Client(options))
    return actions.create({ actionName: 'random_package_action_test', action: content }).then(result => {
      return actions.invoke({
        actionName: 'random_package_action_test',
        params: { hello: 'world' },
        blocking: true
      }).then(invokeResult => {
        t.deepEqual(invokeResult.response.result, { hello: 'world' })
        t.true(invokeResult.response.success)
        t.pass()
        return actions.delete({ actionName: 'random_package_action_test' }).catch(errors)
      })
    })
  }).catch(errors)
})

test('create, get and delete sequence action', t => {
  const errors = err => {
    console.log(err)
    t.fail()
  }

  const actions = new Actions(new Client(options))
  return actions.create({
    actionName: 'my_sequence',
    sequence: ['/whisk.system/utils/echo']
  }).then(result => {
    t.is(result.name, 'my_sequence')
    t.is(result.namespace, NAMESPACE)
    t.is(result.exec.kind, 'sequence')
    t.deepEqual(result.exec.components, ['/whisk.system/utils/echo'])
    return actions.get({ actionName: 'my_sequence' }).then(actionResult => {
      t.is(actionResult.name, 'my_sequence')
      t.is(actionResult.namespace, NAMESPACE)
      t.pass()
      return actions.delete({ actionName: 'my_sequence' }).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

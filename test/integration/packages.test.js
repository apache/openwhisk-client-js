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
const Packages = require('../../lib/packages.js')
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

test('list all packages using default namespace', t => {
  const packages = new Packages(new Client(options))
  return packages.list().then(result => {
    t.true(Array.isArray(result))
    result.forEach(packageName => {
      t.is(packageName.namespace, NAMESPACE)
    })
    t.pass()
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

test('list all packages using options namespace', t => {
  const packages = new Packages(new Client(options))
  return packages.list({ namespace: NAMESPACE }).then(result => {
    t.true(Array.isArray(result))
    result.forEach(packageName => {
      t.is(packageName.namespace, NAMESPACE)
    })
    t.pass()
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

test('get a non-existing package, expecting 404', async t => {
  const packages = new Packages(new Client(options))
  await packages.get({ name: 'glorfindel' }).catch(err => {
    t.is(err.statusCode, 404)
  })
})

test('create, get and delete an package', t => {
  const errors = err => {
    console.log(err)
    t.fail()
  }

  const packages = new Packages(new Client(options))
  return packages.create({ packageName: 'random_package_test' }).then(result => {
    t.is(result.name, 'random_package_test')
    t.is(result.namespace, NAMESPACE)
    t.deepEqual(result.annotations, [])
    t.is(result.version, '0.0.1')
    return packages.get({ packageName: 'random_package_test' }).then(packageResult => {
      t.is(packageResult.name, 'random_package_test')
      t.is(packageResult.namespace, NAMESPACE)
      t.pass()
      return packages.delete({ packageName: 'random_package_test' }).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

test('create and update an package', t => {
  const errors = err => {
    console.log(err)
    t.fail()
  }

  const packages = new Packages(new Client(options))
  return packages.create({ packageName: 'random_package_update_test' }).then(result => {
    t.is(result.name, 'random_package_update_test')
    t.is(result.namespace, NAMESPACE)
    t.deepEqual(result.annotations, [])
    t.is(result.version, '0.0.1')
    return packages.update({ packageName: 'random_package_update_test' }).then(updateResult => {
      t.is(updateResult.version, '0.0.2')
      t.pass()
      return packages.delete({ packageName: 'random_package_update_test' }).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

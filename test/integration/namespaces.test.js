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
const Namespaces = require('../../lib/namespaces.js')
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

test('list all namespaces', t => {
  const namespaces = new Namespaces(new Client(options))
  return namespaces.list().then(result => {
    t.true(Array.isArray(result))
    t.pass()
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

test('retrieve individual namespaces', t => {
  const namespaces = new Namespaces(new Client(options))
  return namespaces.list().then(result => {
    t.true(Array.isArray(result))
    return Promise.all(result.map(ns => namespaces.get({ namespace: ns })))
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

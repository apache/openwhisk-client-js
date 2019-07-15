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
const Feeds = require('../../lib/feeds.js')
const Triggers = require('../../lib/triggers.js')
const Client = require('../../lib/client.js')
const Utils = require('./utils.js')
const options = Utils.autoOptions()
const tempTest = Utils.getInsecureFlag() ? test.skip : test

const envParams = ['API_KEY', 'API_HOST', 'NAMESPACE']

// check that mandatory configuration properties are available
envParams.forEach(key => {
  const param = `__OW_${key}`
  if (!process.env.hasOwnProperty(param)) {
    throw new Error(`Missing ${param} environment parameter`)
  }
})

const NAMESPACE = process.env.__OW_NAMESPACE

tempTest('create, get, update, and delete a feed', async t => {
  const feeds = new Feeds(new Client(options))
  const triggers = new Triggers(new Client(options))
  const feedParams = {
    feedName: '/whisk.system/alarms/alarm',
    trigger: `/${NAMESPACE}/sample_feed_trigger`,
    params: { cron: '*/8 * * * * *', trigger_payload: { name: 'test', place: 'hello' } }
  }

  try {
    await triggers.create({ triggerName: 'sample_feed_trigger' })
    const result = await feeds.create(feedParams)
    t.is(result.response.success, true)

    const getResult = await feeds.get(feedParams)
    t.is(getResult.response.success, true)

    feedParams.cron = '* * * * * *'
    const updateResult = await feeds.update(feedParams)
    t.is(updateResult.response.success, true)

    const deleteResult = await feeds.delete(feedParams)
    t.is(deleteResult.response.success, true)

    await triggers.delete({ triggerName: 'sample_feed_trigger' })
    t.pass()
  } catch (err) {
    console.log(err)
    t.fail()
  }
})

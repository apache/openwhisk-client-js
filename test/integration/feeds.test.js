// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

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
    params: {cron: '*/8 * * * * *', trigger_payload: {name: 'test', place: 'hello'}}
  }

  try {
    await triggers.create({triggerName: 'sample_feed_trigger'})
    const result = await feeds.create(feedParams)
    t.is(result.response.success, true)

    const getResult = await feeds.get(feedParams)
    t.is(getResult.response.success, true)

    feedParams.cron = '* * * * * *'
    const updateResult = await feeds.update(feedParams)
    t.is(updateResult.response.success, true)

    const deleteResult = await feeds.delete(feedParams)
    t.is(deleteResult.response.success, true)

    await triggers.delete({triggerName: 'sample_feed_trigger'})
    t.pass()
  } catch (err) {
    console.log(err)
    t.fail()
  }
})

'use strict'

const test = require('ava')
const Feeds = require('../../lib/feeds.js')
const Triggers = require('../../lib/triggers.js')
const Client = require('../../lib/client.js')

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
  throw new Error('Missing OW_NAMESPACE environment parameter')
}

test('create and delete a feed', t => {
  const params = {api: API_URL, api_key: API_KEY, namespace: NAMESPACE}

  const errors = err => {
    console.log(err)
    t.fail()
  }

  const feeds = new Feeds(new Client(params))
  const triggers = new Triggers(new Client(params))
  const feed_params = {
    feedName: '/whisk.system/alarms/alarm',
    trigger: `/${NAMESPACE}/sample_feed_trigger`,
    params: {cron: '*/8 * * * * *', trigger_payload: {name: 'test', place: 'hello'}}
  }
  return triggers.create({triggerName: 'sample_feed_trigger'}).then(() => feeds.create(feed_params)).then(result => {
    t.is(result.response.success, true)
    return feeds.delete(feed_params).then(feed_result => {
      t.is(feed_result.response.success, true)
      return triggers.delete({triggerName: 'sample_feed_trigger'}).then(() => {
        t.pass()
      })
    }).catch(errors)
  }).catch(errors)
})

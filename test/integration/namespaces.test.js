'use strict'

const test = require('ava')
const Namespaces = require('../../lib/namespaces.js')

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

test('list all namespaces', t => {
  const params = {api: API_URL, api_key: API_KEY}

  const namespaces = new Namespaces(params)
  return namespaces.list().then(result => {
    t.true(Array.isArray(result))
    t.pass()
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

test('retrieve individual namespaces', t => {
  const params = {api: API_URL, api_key: API_KEY}

  const namespaces = new Namespaces(params)
  return namespaces.list().then(result => {
    t.true(Array.isArray(result))
    return Promise.all(result.map(ns => namespaces.get({namespace: ns})))
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

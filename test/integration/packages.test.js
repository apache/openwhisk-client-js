'use strict'

const test = require('ava')
const Packages = require('../../lib/packages.js')

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

test('list all packages using default namespace', t => {
  const params = {api: API_URL, api_key: API_KEY, namespace: NAMESPACE}

  const packages = new Packages(params)
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
  const params = {api: API_URL, api_key: API_KEY}

  const packages = new Packages(params)
  return packages.list({namespace: NAMESPACE}).then(result => {
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

test('create, get and delete an package', t => {
  const params = {api: API_URL, api_key: API_KEY, namespace: NAMESPACE}

  const errors = err => {
    console.log(err)
    t.fail()
  }

  const packages = new Packages(params)
  return packages.create({packageName: 'random_package_test'}).then(result => {
    t.is(result.name, 'random_package_test')
    t.is(result.namespace, NAMESPACE)
    t.deepEqual(result.annotations, [])
    t.is(result.version, '0.0.1')
    return packages.get({packageName: 'random_package_test'}).then(package_result => {
      t.is(package_result.name, 'random_package_test')
      t.is(package_result.namespace, NAMESPACE)
      t.pass()
      return packages.delete({packageName: 'random_package_test'}).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

test('create and update an package', t => {
  const params = {api: API_URL, api_key: API_KEY, namespace: NAMESPACE}

  const errors = err => {
    console.log(err)
    t.fail()
  }

  const packages = new Packages(params)
  return packages.create({packageName: 'random_package_update_test'}).then(result => {
    t.is(result.name, 'random_package_update_test')
    t.is(result.namespace, NAMESPACE)
    t.deepEqual(result.annotations, [])
    t.is(result.version, '0.0.1')
    return packages.update({packageName: 'random_package_update_test'}).then(update_result => {
      t.is(update_result.version, '0.0.2')
      t.pass()
      return packages.delete({packageName: 'random_package_update_test'}).catch(errors)
    }).catch(errors)
  }).catch(errors)
})

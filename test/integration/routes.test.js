'use strict'

const test = require('ava')
const Actions = require('../../lib/actions.js')
const Routes = require('../../lib/routes.js')

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

test('create, retrieve and delete action route', t => {
  const params = {api: API_URL, api_key: API_KEY}

  const routes = new Routes(params)
  const actions = new Actions(params)

  return actions.create({actionName: 'routeAction', action: ''}).then(() => {
    return routes.create({action: 'routeAction', basepath: '/testing', relpath: '/foo/bar', operation: 'POST'}).then(() => {
      return routes.list({basepath: '/testing'}).then(results => {
        t.is(results.apis.length, 1)
        const apidoc = results.apis[0].value.apidoc
        t.is(apidoc.basePath, '/testing')
        t.true(apidoc.paths.hasOwnProperty('/foo/bar'))
        const path = apidoc.paths['/foo/bar']
        t.true(path.hasOwnProperty('post'))
        t.is(path.post['x-ibm-op-ext'].actionName, 'routeAction')

        return routes.delete({basepath: '/testing'}).then(() => actions.delete({actionName: 'routeAction'}))
      })
    })
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

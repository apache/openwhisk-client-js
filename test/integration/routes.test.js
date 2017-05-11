'use strict'

const test = require('ava')
const Actions = require('../../lib/actions.js')
const Routes = require('../../lib/routes.js')
const Client = require('../../lib/client.js')

const envParams = ['API_KEY', 'API_HOST', 'APIGW_TOKEN']

// check that mandatory configuration properties are available
envParams.forEach(key => {
  const param = `__OW_${key}` 
  if (!process.env.hasOwnProperty(param)) {
    throw new Error(`Missing ${param} environment parameter`)
  }
})

test.serial('create, retrieve and delete action route', t => {
  const token = process.env.__OW_APIGW_TOKEN
  delete process.env.__OW_APIGW_TOKEN
  const routes = new Routes(new Client())
  const actions = new Actions(new Client())
  process.env.__OW_APIGW_TOKEN = token

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

test.serial('create, retrieve and delete action route using token', t => {
  const routes = new Routes(new Client())
  const actions = new Actions(new Client())

  return actions.create({actionName: 'routeAction', action: ''}).then(() => {
    return routes.create({action: 'routeAction', basepath: '/testing', relpath: '/foo/bar', operation: 'POST'}).then(() => {
      return routes.list({basepath: '/testing'}).then(results => {
        t.is(results.apis.length, 1)
        const apidoc = results.apis[0].value.apidoc
        t.is(apidoc.basePath, '/testing')
        t.true(apidoc.paths.hasOwnProperty('/foo/bar'))
        const path = apidoc.paths['/foo/bar']
        t.true(path.hasOwnProperty('post'))
        t.is(path.post['x-openwhisk'].action, 'routeAction')

        return routes.delete({basepath: '/testing'}).then(() => actions.delete({actionName: 'routeAction'}))
      })
    })
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

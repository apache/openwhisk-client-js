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
const Routes = require('../../lib/routes.js')
const Client = require('../../lib/client.js')
const Utils = require('./utils.js')
const options = Utils.autoOptions()

const envParams = ['API_KEY', 'API_HOST', 'APIGW_TOKEN']

// check that mandatory configuration properties are available
envParams.forEach(key => {
  const param = `__OW_${key}`
  if (!process.env.hasOwnProperty(param)) {
    throw new Error(`Missing ${param} environment parameter`)
  }
})

test.serial('create, retrieve and delete action route using token', t => {
  const routes = new Routes(new Client(options))
  const actions = new Actions(new Client(options))

  return actions.create({ actionName: 'routeAction', action: '' }).then(() => {
    return routes.create({
      action: 'routeAction',
      basepath: '/testing',
      relpath: '/foo/bar',
      operation: 'POST'
    }).then(() => {
      return routes.list({ basepath: '/testing' }).then(results => {
        t.is(results.apis.length, 1)
        const apidoc = results.apis[0].value.apidoc
        t.is(apidoc.basePath, '/testing')
        t.true(apidoc.paths.hasOwnProperty('/foo/bar'))
        const path = apidoc.paths['/foo/bar']
        t.true(path.hasOwnProperty('post'))
        t.is(path.post['x-openwhisk'].action, 'routeAction')

        return routes.delete({ basepath: '/testing' }).then(() => actions.delete({ actionName: 'routeAction' }))
      })
    })
  }).catch(err => {
    console.log(err)
    t.fail()
  })
})

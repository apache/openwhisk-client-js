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

const BaseOperation = require('./base_operation')
const messages = require('./messages')
const names = require('./names')
const CREATE_PARAMS = ['relpath', 'operation', 'action']

class Routes extends BaseOperation {
  constructor (client, routeApiPathMapper) {
    super(client)
    if (typeof routeApiPathMapper === 'function') {
      this.routeApiPathMapper = routeApiPathMapper
    } else if (routeApiPathMapper) {
      throw new Error('Illegal parameter, must be a function.')
    }
  }

  routeMgmtApiPath (path) {
    if (this.routeApiPathMapper) {
      return this.routeApiPathMapper(path)
    } else {
      return `web/whisk.system/apimgmt/${path}`
    }
  }

  get (options) {
    options = options || {}
    options.basepath = this.basepath(options)

    return this.list(this.qs(options, ['basepath']))
  }

  list (options) {
    options = options || {}
    if (this.hasBasepath(options)) {
      options.basepath = this.calculateBasepath(options)
    }

    const qs = this.qs(options, ['relpath', 'basepath', 'operation', 'limit', 'skip'])
    return this.client.request('GET', this.routeMgmtApiPath('getApi'), { qs })
  }

  qs (options, names) {
    const result = super.qs(options, names)

    if (this.hasAccessToken()) {
      result.accesstoken = this.client.options.apigwToken
      result.spaceguid = this.client.options.apigwSpaceGuid
    }

    return result
  }

  hasBasepath (options) {
    return !!(options.name || options.basepath)
  }

  basepath (options) {
    if (!this.hasBasepath(options)) {
      throw new Error(messages.MISSING_BASEPATH_ERROR)
    }

    return this.calculateBasepath(options)
  }

  calculateBasepath (options) {
    if (options.name && options.basepath) {
      throw new Error(messages.INVALID_BASEPATH_ERROR)
    }

    return options.basepath || options.name
  }

  missingBasepath (options) {
    return !(options.name || options.basepath)
  }

  delete (options) {
    options = options || {}
    options.basepath = this.basepath(options)

    const qs = this.qs(options, ['relpath', 'basepath', 'operation'])
    qs.force = true
    return this.client.request('DELETE', this.routeMgmtApiPath('deleteApi'), { qs })
  }

  create (options) {
    const body = this.createBody(options || {})
    const qs = this.qs(options, ['responsetype'])
    return this.client.request('POST', this.routeMgmtApiPath('createApi'), { body, qs })
  }

  createBody (options) {
    if (options.swagger) {
      return { apidoc: { namespace: '_', swagger: options.swagger } }
    }

    const missing = CREATE_PARAMS.filter(param => !(options || {}).hasOwnProperty(param))

    if (missing.length) {
      throw new Error(`Missing mandatory parameters: ${missing.join(', ')}`)
    }

    return this.routeSwaggerDefinition(options)
  }

  routeSwaggerDefinition (params) {
    const apidoc = {
      namespace: '_',
      gatewayBasePath: this.routeBasepath(params),
      gatewayPath: params.relpath,
      gatewayMethod: params.operation,
      id: `API:_:${this.routeBasepath(params)}`,
      action: this.routeSwaggerAction(params)
    }

    const pathParameters = this.parsePathParameters(params.relpath)

    if (pathParameters.length) {
      apidoc.pathParameters = pathParameters.map(this.createPathParameter)
    }

    if (params.name) {
      apidoc.apiName = params.name
    }

    return { apidoc }
  }

  routeSwaggerAction (params) {
    const id = names.parseId(params.action)
    let namespace = decodeURIComponent(this.namespace(params))
    if (params.action.startsWith('/')) {
      namespace = names.parseNamespace(params.action)
    }

    const body = {
      name: id,
      namespace: namespace,
      backendMethod: `GET`,
      backendUrl: this.actionUrlPath(id, namespace),
      authkey: this.client.options.apiKey
    }

    if (params.secure_key) {
      body.secureKey = params.secure_key
    }

    return body
  }

  routeBasepath (params) {
    return params.basepath || '/'
  }

  actionUrlPath (id, namespace) {
    // web action path must contain package identifier. uses default for
    // non-explicit package.
    if (!id.includes('/')) {
      id = `default/${id}`
    }

    return this.client.pathUrl(`web/${namespace}/${id}.http`)
  }

  hasAccessToken () {
    return !!this.client.options.apigwToken
  }

  // return list of path parameters from paths
  // e.g. /book/{id}
  // Multiple parameters are supported.
  parsePathParameters (path) {
    const regex = /{([^}]+)\}/g
    const findAllParams = p => {
      const ids = []
      let id = regex.exec(p)
      while (id) {
        ids.push(id[1])
        id = regex.exec(p)
      }
      return ids
    }

    return path.split('/')
      .map(findAllParams)
      .reduce((sum, el) => sum.concat(el), [])
  }

  createPathParameter (name) {
    return {
      name: name,
      in: 'path',
      description: `Default description for '${name}'`,
      required: true,
      type: 'string'
    }
  }
}

module.exports = Routes

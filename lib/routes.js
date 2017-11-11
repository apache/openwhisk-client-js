// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

'use strict'

const BaseOperation = require('./base_operation')
const messages = require('./messages')
const names = require('./names')
const CREATE_PARAMS = ['relpath', 'operation', 'action']

class Routes extends BaseOperation {
  routeMgmtApiPath (path) {
    return `web/whisk.system/apimgmt/${path}.http`
  }

  get (options) {
    options = options || {}
    options.basepath = this.basepath(options)

    return this.list(this.qs(options, ['basepath']))
  }

  list (options) {
    options = options || {}
    if (this.has_basepath(options)) {
      options.basepath = this.calculate_basepath(options)
    }

    const qs = this.qs(options, ['relpath', 'basepath', 'operation', 'limit', 'skip'])
    return this.client.request('GET', this.routeMgmtApiPath('getApi'), { qs })
  }

  qs (options, names) {
    const result = super.qs(options, names)

    if (this.has_access_token()) {
      result.accesstoken = this.client.options.apigw_token
      result.spaceguid = this.client.options.apigw_space_guid
    }

    return result
  }

  has_basepath (options) {
    return !!(options.name || options.basepath)
  }

  basepath (options) {
    if (!this.has_basepath(options)) {
      throw new Error(messages.MISSING_BASEPATH_ERROR)
    }

    return this.calculate_basepath(options)
  }

  calculate_basepath (options) {
    if (options.name && options.basepath) {
      throw new Error(messages.INVALID_BASEPATH_ERROR)
    }

    return options.basepath || options.name
  }

  missing_basepath (options) {
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
    const body = this.create_body(options || {})
    const qs = this.qs(options, ['responsetype'])
    return this.client.request('POST', this.routeMgmtApiPath('createApi'), { body, qs })
  }

  create_body (options) {
    if (options.swagger) {
      return { apidoc: { namespace: '_', swagger: options.swagger } }
    }

    const missing = CREATE_PARAMS.filter(param => !(options || {}).hasOwnProperty(param))

    if (missing.length) {
      throw new Error(`Missing mandatory parameters: ${missing.join(', ')}`)
    }

    return this.route_swagger_definition(options)
  }

  route_swagger_definition (params) {
    const apidoc = {
      namespace: '_',
      gatewayBasePath: this.route_base_path(params),
      gatewayPath: params.relpath,
      gatewayMethod: params.operation,
      id: `API:_:${this.route_base_path(params)}`,
      action: this.route_swagger_action(params)
    }

    if (params.name) {
      apidoc.apiName = params.name
    }

    return { apidoc }
  }

  route_swagger_action (params) {
    const id = names.parse_id(params.action)
    let namespace = decodeURIComponent(this.namespace(params))
    if (params.action.startsWith('/')) {
      namespace = names.parse_namespace(params.action)
    }
    return {
      name: id,
      namespace: namespace,
      backendMethod: `GET`,
      backendUrl: this.action_url_path(id, namespace),
      authkey: this.client.options.api_key
    }
  }

  route_base_path (params) {
    return params.basepath || '/'
  }

  action_url_path (id, namespace) {
    // web action path must contain package identifier. uses default for
    // non-explicit package.
    if (!id.includes('/')) {
      id = `default/${id}`
    }

    return this.client.path_url(`web/${namespace}/${id}.http`)
  }

  has_access_token () {
    return !!this.client.options.apigw_token
  }
}

module.exports = Routes

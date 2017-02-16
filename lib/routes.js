'use strict'

const BaseOperation = require('./base_operation')
const messages = require('./messages')

const CREATE_PARAMS = ['relpath', 'operation', 'action']

class Routes extends BaseOperation {
  list (options) {
    options = options || {}
    const qs = this.qs(options, ['relpath', 'basepath', 'operation', 'limit', 'skip'])
    return this.client.request('GET', `experimental/routemgmt`, { qs })
  }

  delete (options) {
   if (!options || !options.hasOwnProperty('basepath')) {
      throw new Error(messages.MISSING_BASEPATH_ERROR)
    }

    const qs = this.qs(options, ['relpath', 'basepath', 'operation'])
    qs.force = true
    return this.client.request('DELETE', `experimental/routemgmt`, { qs })
  }

  create (options) {
    const missing = CREATE_PARAMS.filter(param => !(options || {}).hasOwnProperty(param))

    if (missing.length) {
      throw new Error(`Missing mandatory parameters: ${missing.join(', ')}`)
    }

    const body = this.route_swagger_definition(options)
    return this.client.request('POST', `experimental/routemgmt`, { body })
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

    return { apidoc }
  }

  route_swagger_action (params) {
    const id = this.action_name_and_ns(params.action)
    return {
      name: id.name,
      namespace: id.namespace,
      backendMethod: 'POST',
      backendUrl: this.action_url_path(id),
      authkey: this.client.options.api_key
    }
  }

  route_base_path (params) {
    return params.basepath || '/'
  }

  action_name_and_ns (id) {
    if (!id.startsWith('/')) {
      return { name: id, namespace: '_' }
    }

    const paths = id.split('/')
    const namespace = paths[1]
    const name = paths.slice(2).join('/')
    return { namespace, name }
  }

  action_url_path (id) {
    const path = `namespaces/${id.namespace}/actions/${id.name}`
    return this.client.path_url(path)
  }
}

module.exports = Routes

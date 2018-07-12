// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

'use strict'

const messages = require('./messages')
const Resources = require('./resources')

class Actions extends Resources {
  constructor (client) {
    super(client)
    this.resource = 'actions'
    this.identifiers.push('actionName')
    this.qs_options.invoke = ['blocking']
  }

  list (options) {
    options = options || {}
    options.qs = this.qs(options, ['skip', 'limit', 'count'])

    return super.list(options)
  }

  get (options) {
    options = this.parseOptions(options)
    options.qs = this.qs(options, ['code'])

    return this.operationWithId('GET', options)
  }

  invoke (options) {
    options = options || {}
    if (options.blocking && options.result) {
      return super.invoke(options).then(result => result.response.result)
    }

    return super.invoke(options)
  }

  create (options) {
    options.qs = this.qs(options, ['overwrite'])
    options.body = this.actionBody(options)

    return super.create(options)
  }

  actionBody (options) {
    if (!options.hasOwnProperty('action')) {
      throw new Error(messages.MISSING_ACTION_BODY_ERROR)
    }
    const body = {exec: {kind: options.kind || 'nodejs:default', code: options.action}}

    // allow options to override the derived exec object
    if (options.exec) {
      body.exec = Object.assign(body.exec, options.exec)
    }

    if (options.action instanceof Buffer) {
      body.exec.code = options.action.toString('base64')
    } else if (typeof options.action === 'object') {
      return options.action
    }

    if (typeof options.params === 'object') {
      body.parameters = Object.keys(options.params).map(key => ({key, value: options.params[key]}))
    }

    if (options.version) {
      body.version = options.version
    }

    if (options.limits) {
      body.limits = options.limits
    }

    if (typeof options.annotations === 'object') {
      body.annotations = Object.keys(options.annotations).map(key => ({ key, value: options.annotations[key] }))
    }

    return body
  }
}

module.exports = Actions

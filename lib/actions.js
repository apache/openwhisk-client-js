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
      return super.invoke(options).then(result => {
        if (result.response) {
          return result.response.result
        } else return Promise.reject(result)
      })
    }

    return super.invoke(options)
  }

  create (options) {
    options.qs = this.qs(options, ['overwrite'])
    options.body = this.actionBody(options)

    return super.create(options)
  }

  actionBodyWithCode (options) {
    const body = { exec: { kind: options.kind || 'nodejs:default', code: options.action } }

    // allow options to override the derived exec object
    if (options.exec) {
      body.exec = Object.assign(body.exec, options.exec)
    }

    if (options.action instanceof Buffer) {
      body.exec.code = options.action.toString('base64')
    }

    return body
  }

  actionBodyWithSequence (options) {
    if (!(options.sequence instanceof Array)) {
      throw new Error(messages.INVALID_SEQ_PARAMETER)
    }

    if (options.sequence.length === 0) {
      throw new Error(messages.INVALID_SEQ_PARAMETER_LENGTH)
    }

    const body = { exec: { kind: 'sequence', components: options.sequence } }
    return body
  }

  actionBody (options) {
    const isUpdate = options && options.overwrite === true
    const isCodeAction = options.hasOwnProperty('action')
    const isSequenceAction = options.hasOwnProperty('sequence')

    if (!isCodeAction && !isSequenceAction && !isUpdate) {
      throw new Error(messages.MISSING_ACTION_OR_SEQ_BODY_ERROR)
    }

    if (isCodeAction && isSequenceAction) {
      throw new Error(messages.INVALID_ACTION_AND_SEQ_PARAMETERS)
    }

    // user can manually define & control exact action definition by passing in an object
    if (isCodeAction && typeof options.action === 'object' &&
      (!(options.action instanceof Buffer))) {
      return options.action
    }

    const body = isCodeAction
      ? this.actionBodyWithCode(options)
      : isSequenceAction ? this.actionBodyWithSequence(options) : {}

    if (typeof options.params === 'object') {
      body.parameters = Object.keys(options.params).map(key => ({ key, value: options.params[key] }))
    }

    if (options.version) {
      body.version = options.version
    }

    if (options.limits) {
      body.limits = options.limits
    }

    return body
  }
}

module.exports = Actions

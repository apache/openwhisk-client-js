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
    options.qs = this.qs(options, ['skip', 'limit'])

    return super.list(options)
  }

  create (options) {
    options.qs = this.qs(options, ['overwrite'])
    options.body = this.action_body(options)

    return super.create(options)
  }

  action_body (options) {
    if (!options.hasOwnProperty('action')) {
      throw new Error(messages.MISSING_ACTION_BODY_ERROR)
    }

    if (options.action instanceof Buffer) {
      options.action = options.action.toString('base64')
    } else if (typeof options.action === 'object') {
      return options.action
    }

    return { exec: { kind: 'nodejs:default', code: options.action } }
  }
}

module.exports = Actions

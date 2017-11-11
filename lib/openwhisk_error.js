// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

'use strict'

module.exports = function OpenWhiskError (message, error, statusCode) {
  Error.captureStackTrace(this, this.constructor)
  this.name = this.constructor.name
  this.message = message
  this.error = error
  this.statusCode = statusCode
}

require('util').inherits(module.exports, Error)

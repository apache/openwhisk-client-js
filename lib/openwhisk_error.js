'use strict';

module.exports = function OpenWhiskError(message, error, statusCode) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.error = error;
  this.statusCode = statusCode;
};

require('util').inherits(module.exports, Error);

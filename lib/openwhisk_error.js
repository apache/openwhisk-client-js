'use strict';

module.exports = function OpenWhiskError(message, error) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.error = error;
};

require('util').inherits(module.exports, Error);

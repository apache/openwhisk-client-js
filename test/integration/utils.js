// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

function getInsecureFlag () {
  return process.env['__OW_INSECURE'] === 'true'
}

function autoOptions () {
  const options = {}
  if (getInsecureFlag()) {
    options.ignore_certs = true
    options.apigw_token = true
  }
  return options
}

module.exports = {
  getInsecureFlag: getInsecureFlag,
  autoOptions: autoOptions
}

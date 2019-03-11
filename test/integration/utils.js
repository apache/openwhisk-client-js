// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

function getInsecureFlag () {
  let npmConfigArgObj = process.env.npm_config_argv ? JSON.parse(process.env.npm_config_argv) : null
  if (npmConfigArgObj) {
    return npmConfigArgObj.original && npmConfigArgObj.original[2] === '-i'
  }
  return false
}

function autoOptions () {
  var options = {}
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

// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

const messages = require('./messages')

const default_namespace = () => {
  return process.env['__OW_NAMESPACE'] || '_'
}

// valid resource identifiers
// - resource_name
// - package/resource_name
// - /namespace/resource_name
// - /namespace/package/resource_name
// - namespace/package/resource_name
const parse_id_and_ns = resource => {
  const parts = (resource.match(/\//g) || []).length
  const names = resource.split('/')

  // checking for `resource_name` and `package/resource_name`
  if (parts === 0 ||
     (parts === 1 && !resource.startsWith('/'))) {
    return { namespace: default_namespace(), id: resource }
  }

  // checking for `/namespace/resource_name` and `namespace/package/resource_name`
  if (parts === 2) {
    if (resource.startsWith('/')) {
      return { namespace: names[1], id: names[2] }
    } else {
      return { namespace: names[0], id: `${names[1]}/${names[2]}` }
    }
  }

  // checking for `/namespace/package/resource_name`
  if (parts === 3 && resource.startsWith('/')) {
    return { namespace: names[1], id: `${names[2]}/${names[3]}` }
  }

  throw new Error(messages.INVALID_RESOURCE_ERROR)
}

const parse_namespace = id => parse_id_and_ns(id).namespace
const parse_id = id => parse_id_and_ns(id).id

module.exports = {
  default_namespace,
  parse_namespace,
  parse_id
}

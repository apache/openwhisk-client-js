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
const parse_id_and_ns = resource => {
  if (!resource.startsWith('/')) {
    return { namespace: default_namespace(), id: resource }
  }

  const paths = resource.split('/')

  if (paths.length !== 3 && paths.length !== 4) {
    throw new Error(messages.INVALID_RESOURCE_ERROR)
  }

  const id = paths.slice(2).join('/')
  const namespace = paths[1]

  return { id, namespace }
}

const parse_namespace = id => parse_id_and_ns(id).namespace
const parse_id = id => parse_id_and_ns(id).id

module.exports = {
  default_namespace,
  parse_namespace,
  parse_id
}

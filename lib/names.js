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

const messages = require('./messages')

const defaultNamespace = () => {
  return process.env['__OW_NAMESPACE'] || '_'
}

// valid resource identifiers
// - resourceName
// - package/resourceName
// - /namespace/resourceName
// - /namespace/package/resourceName
// - namespace/package/resourceName
const parseIdAndNs = resource => {
  const parts = (resource.match(/\//g) || []).length
  const names = resource.split('/')

  // checking for `resource_name` and `package/resource_name`
  if (parts === 0 ||
     (parts === 1 && !resource.startsWith('/'))) {
    return { namespace: defaultNamespace(), id: resource }
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

const parseNamespace = id => parseIdAndNs(id).namespace
const parseId = id => parseIdAndNs(id).id

module.exports = {
  defaultNamespace: defaultNamespace,
  parseNamespace: parseNamespace,
  parseId: parseId
}

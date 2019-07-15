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

const test = require('ava')
const names = require('../../lib/names')

test('should return default namespace', t => {
  t.is(names.defaultNamespace(), '_')
})

test('should return default namespace from env param', t => {
  process.env['__OW_NAMESPACE'] = 'testing'
  t.is(names.defaultNamespace(), 'testing')
  delete process.env['__OW_NAMESPACE']
})

test('should parse namespace from resource without explicit ns', t => {
  t.is(names.parseNamespace('hello'), '_')
})

test('should parse namespace from package resource without explicit ns', t => {
  t.is(names.parseNamespace('pkg/hello'), '_')
})

test('should parse namespace from resource with explicit ns', t => {
  t.is(names.parseNamespace('/ns/hello'), 'ns')
})

test('should parse namespace from package resource with explicit ns', t => {
  t.is(names.parseNamespace('/ns/pkg/hello'), 'ns')
})

test('should parse namespace from resource with explicit ns and package but missing leading slash', t => {
  t.is(names.parseNamespace('ns/pkg/hello'), 'ns')
})

test('should throw error parsing namespace with only namespace', t => {
  t.throws(() => names.parseNamespace('/ns'), /Invalid resource identifier/)
})

test('should throw error parsing namespace with only extra paths', t => {
  t.throws(() => names.parseNamespace('/ns/pkg/action/extra'), /Invalid resource identifier/)
  t.throws(() => names.parseNamespace('ns/pkg/action/extra'), /Invalid resource identifier/)
})

test('should throw error parsing namespace with missing parts', t => {
  t.throws(() => names.parseNamespace('/'), /Invalid resource identifier/)
})

test('should parse id from resource without explicit ns', t => {
  t.is(names.parseId('hello'), 'hello')
})

test('should parse id from package resource without explicit ns', t => {
  t.is(names.parseId('pkg/hello'), 'pkg/hello')
})

test('should parse id from resource with explicit ns', t => {
  t.is(names.parseId('/ns/hello'), 'hello')
})

test('should parse id from package resource with explicit ns', t => {
  t.is(names.parseId('/ns/pkg/hello'), 'pkg/hello')
})

test('should parse id from resource with explicit ns and package but missing leading slash', t => {
  t.is(names.parseId('ns/pkg/hello'), 'pkg/hello')
})

test('should throw error parsing id with only namespace', t => {
  t.throws(() => names.parseId('/ns'), /Invalid resource identifier/)
})

test('should throw error parsing id with only extra paths', t => {
  t.throws(() => names.parseId('/ns/pkg/action/extra'), /Invalid resource identifier/)
  t.throws(() => names.parseId('ns/pkg/action/extra'), /Invalid resource identifier/)
})

test('should throw error parsing id with missing parts', t => {
  t.throws(() => names.parseId('/'), /Invalid resource identifier/)
})

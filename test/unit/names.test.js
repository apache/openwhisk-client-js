'use strict'

const test = require('ava')
const names = require('../../lib/names')

test('should return default namespace', t => {
  t.is(names.default_namespace(), '_')
})

test('should return default namespace from env param', t => {
  process.env['__OW_NAMESPACE'] = 'testing'
  t.is(names.default_namespace(), 'testing')
  delete process.env['__OW_NAMESPACE']
})

test('should parse namespace from resource without explicit ns', t => {
  t.is(names.parse_namespace('hello'), '_')
})

test('should parse namespace from resource with explicit ns', t => {
  t.is(names.parse_namespace('/ns/hello'), 'ns')
})

test('should parse namespace from resource with explicit ns and package', t => {
  t.is(names.parse_namespace('/ns/pkg/hello'), 'ns')
})

test('should throw error for resource with only namespace', t => {
  t.throws(() => names.parse_namespace('/ns'), /Invalid resource identifier/)
})

test('should throw error for resource with only extra paths', t => {
  t.throws(() => names.parse_namespace('/ns/pkg/action/extra'), /Invalid resource identifier/)
})

test('should parse id from resource without explicit ns', t => {
  t.is(names.parse_id('hello'), 'hello')
})

test('should parse id from resource with explicit ns', t => {
  t.is(names.parse_id('/ns/hello'), 'hello')
})

test('should parse id from resource with explicit ns and package', t => {
  t.is(names.parse_id('/ns/pkg/hello'), 'pkg/hello')
})

test('should throw error for resource with only namespace', t => {
  t.throws(() => names.parse_id('/ns'), /Invalid resource identifier/)
})

test('should throw error for resource with only extra paths', t => {
  t.throws(() => names.parse_id('/ns/pkg/action/extra'), /Invalid resource identifier/)
})

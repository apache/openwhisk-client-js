'use strict'

const test = require('ava')
const proxyquire = require('proxyquire')
const stub = {}
const ctor = function (options) { this.options = options }
ctor.prototype = stub

const Rules = proxyquire('../../lib/rules.js', {'./base_operation': ctor})

test('list all rules', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/rules`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(3)

  const rules = new Rules(params)
  return rules.list()
})

test('list all rules with options', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const options = {limit: 100, skip: 50, namespace: 'sample'}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${options.namespace}/rules`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.deepEqual(req.qs, {limit: 100, skip: 50})
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(4)

  const rules = new Rules(params)
  return rules.list(options)
})

test('list all rules without providing any namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const rules = new Rules(params)
  return t.throws(() => { rules.list() }, /Missing namespace/)
})

test('get rule using default namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const rule_name = 'rule_name'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/rules/${rule_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(3)

  const rules = new Rules(params)
  return rules.get({ruleName: rule_name})
})

test('get rule using options namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const rule_name = 'rule_name'
  const namespace = 'provided'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${namespace}/rules/${rule_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'GET')
    return Promise.resolve()
  }

  t.plan(3)

  const rules = new Rules(params)
  return rules.get({ruleName: rule_name, namespace: 'provided'})
})

test('get an rule without providing any namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const rules = new Rules(params)
  return t.throws(() => { rules.get({ruleName: 'custom'}) }, /Missing namespace/)
})

test('get a rule without providing a rule name', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const rules = new Rules(params)
  return t.throws(() => { rules.get({namespace: 'custom'}) }, /ruleName/)
})

test('delete rule using default namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const rule_name = 'rule_name'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/rules/${rule_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'DELETE')
    return Promise.resolve()
  }

  t.plan(3)

  const rules = new Rules(params)
  return rules.delete({ruleName: rule_name})
})

test('delete rule using options namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const rule_name = 'rule_name'
  const namespace = 'provided'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${namespace}/rules/${rule_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'DELETE')
    return Promise.resolve()
  }

  t.plan(3)

  const rules = new Rules(params)
  return rules.delete({ruleName: rule_name, namespace: 'provided'})
})

test('delete an rule without providing any namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const rules = new Rules(params)
  return t.throws(() => { rules.delete({ruleName: 'custom'}) }, /Missing namespace/)
})

test('delete an rule without providing an rule name', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const rules = new Rules(params)
  return t.throws(() => { rules.delete({namespace: 'custom'}) }, /ruleName/)
})

test('create a new rule using the default namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const rule_name = 'rule_name'
  const rule = {version: '1.0.0', publish: true, trigger: 'trigger', action: 'action'}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/rules/${rule_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'PUT')
    t.deepEqual(req.body, {action: rule.action, trigger: rule.trigger})
    t.deepEqual(req.qs, {})
    return Promise.resolve()
  }

  t.plan(5)

  const rules = new Rules(params)
  return rules.create({ruleName: rule_name, action: rule.action, trigger: rule.trigger})
})

test('create an rule using options namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const rule_name = 'rule_name'
  const namespace = 'provided'
  const rule = {version: '1.0.0', publish: true, trigger: 'trigger', action: 'action'}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${namespace}/rules/${rule_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'PUT')
    t.deepEqual(req.body, {action: rule.action, trigger: rule.trigger})
    t.deepEqual(req.qs, {overwrite: true})
    return Promise.resolve()
  }

  t.plan(5)

  const rules = new Rules(params)
  return rules.create({ruleName: rule_name, namespace: 'provided', action: rule.action, trigger: rule.trigger, overwrite: true})
})

test('create an rule without providing any namespace', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const rules = new Rules(params)
  return t.throws(() => { rules.create({ruleName: 'custom', action: '', trigger: ''}) }, /Missing namespace/)
})

test('create an rule without providing an rule name', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const rules = new Rules(params)
  return t.throws(() => { rules.create({namespace: 'custom', action: '', trigger: ''}) }, /ruleName/)
})

test('create an rule without providing an action', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const rules = new Rules(params)
  return t.throws(() => { rules.create({namespace: 'custom', ruleName: 'hello', trigger: ''}) }, /action/)
})

test('create an rule without providing a trigger', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key'}

  stub.request = req => {
    t.fail()
  }

  const rules = new Rules(params)
  return t.throws(() => { rules.create({namespace: 'custom', ruleName: 'hello', action: ''}) }, /trigger/)
})

test('update an rule', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const rule_name = 'rule_name'
  const rule = {version: '1.0.0', publish: true, trigger: 'trigger', action: 'action'}

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/rules/${rule_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'PUT')
    t.deepEqual(req.body, {action: rule.action, trigger: rule.trigger})
    t.deepEqual(req.qs, {overwrite: true})
    return Promise.resolve()
  }

  t.plan(5)

  const rules = new Rules(params)
  return rules.update({ruleName: rule_name, action: rule.action, trigger: rule.trigger})
})

test('enable a rule', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const rule_name = 'rule_name'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/rules/${rule_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'POST')
    t.deepEqual(req.body, {status: 'active'})
    return Promise.resolve()
  }

  t.plan(4)

  const rules = new Rules(params)
  return rules.enable({ruleName: rule_name})
})

test('disable a rule', t => {
  const params = {api: 'https://openwhisk.ng.bluemix.net/api/v1/', api_key: 'user_authorisation_key', namespace: 'default'}
  const rule_name = 'rule_name'

  stub.request = req => {
    t.is(req.url, `${params.api}namespaces/${params.namespace}/rules/${rule_name}`)
    t.is(req.headers.Authorization, `Basic ${new Buffer(params.api_key).toString('base64')}`)
    t.is(req.method, 'POST')
    t.deepEqual(req.body, {status: 'inactive'})
    return Promise.resolve()
  }

  t.plan(4)

  const rules = new Rules(params)
  return rules.disable({ruleName: rule_name})
})

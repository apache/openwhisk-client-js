# OpenWhisk Client for JavaScript

[![Build Status](https://travis-ci.org/apache/incubator-openwhisk-client-js.svg?branch=master)](https://travis-ci.org/apache/incubator-openwhisk-client-js)
[![License](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

JavaScript client library for the [Apache OpenWhisk](https://github.com/apache/incubator-openwhisk) platform.
Provides a wrapper around the [OpenWhisk APIs](https://github.com/apache/incubator-openwhisk/blob/fb001afa237476eda0c0f6494ee92702e5986538/core/controller/src/main/resources/apiv1swagger.json) (Swagger JSON).

## installation

```
$ npm install openwhisk
```

## usage

### within openwhisk platform

This client library can use environment parameters to automatically configure the authentication credentials, platform endpoint and namespace. These parameters are defined within the Node.js runtime environment in OpenWhisk. Unless you want to override these values, you can construct the client instance without further configuration.

```
var openwhisk = require('openwhisk');

function action() {
  var ow = openwhisk();
  return ow.actions.invoke('sample')
}

exports.main = action
```

_All methods return a Promise resolved asynchronously with the results. Failures are available through the catch method._

```
ow.resource.operation().then(function () { // success! }).catch(function (err) { // failed! })
```

Users can override default constructor parameters by passing in explicit options as shown in the example below.

_**Please note**: Due to [an issue](https://github.com/openwhisk/openwhisk/issues/1751) with the Node.js runtime in OpenWhisk, environment variables used by the constructor are not available until the invocation function handler is called. If you want to define the client instance outside this function, you will need to manually pass in the constructor options ._

```
var openwhisk = require('openwhisk');
// DOES NOT WORK! Environment parameters not set.
var ow = openwhisk();

function action() {
  return ow.actions.invoke('sample')
}

exports.main = action
```

### outside openwhisk platform

```
var openwhisk = require('openwhisk');
var options = {apihost: 'openwhisk.ng.bluemix.net', api_key: '...'};
var ow = openwhisk(options);
ow.actions.invoke('sample').then(result => console.log(result))
```

### constructor options

_Client constructor supports the following mandatory parameters:_

- **apihost.** Hostname and optional port for openwhisk platform, e.g. `openwhisk.ng.bluemix.net` or `my_whisk_host:80`. Used with API URL template `${protocol}://${apihost}/api/v1/`. If port is missing or port value is 443 in the apihost string, protocol is HTTPS. Otherwise, protocol is HTTP.
- **api_key.** Authorisation key for user account registered with OpenWhisk platform.

*Client constructor supports the following optional parameters:*

- **api.** Full API URL for OpenWhisk platform, e.g. `https://openwhisk.ng.bluemix.net/api/v1/`. This value overrides `apihost` if both are present.
- **namespace**. Namespace for resource requests, defaults to `_`.
- **ignore_certs**. Turns off server SSL/TLS certificate verification. This allows the client to be used against local deployments of OpenWhisk with a self-signed certificate. Defaults to false.
- **apigw_token**. API Gateway service authentication token. This is mandatory for using an external API Gateway service, rather than the built-in api gateway.
- **apigw_space_guid**. API Gateway space identifier. This is optional when using an API gateway service, defaults to the authentication uuid.

### environment variables

Client constructor will read values for the `apihost`, `namespace`, `api_key`, `apigw_token` and `apigw_space_guid` options from the environment if the following parameters are set. Explicit options have precedence over environment values.

- *__OW_API_HOST*
- *__OW_NAMESPACE*
- *__OW_API_KEY*
- *__OW_APIGW_TOKEN*
- *__OW_APIGW_SPACE_SUID*



## Examples

### invoke action, blocking for result

```
const name = 'reverseWords'
const blocking = true, result = true
const params = {msg: 'this is some words to reverse'}

ow.actions.invoke({name, blocking, result, params}).then(result => {
  console.log('here's the reversed string', result.reversed)
}).catch(err => {
  console.error('failed to invoke actions', err)
})
```

### fire trigger

```
const name = 'eventTrigger'
const params = {msg: 'event trigger message string'}
ow.triggers.invoke({name, params}).then(result => {
  console.log('trigger fired!')
}).catch(err => {
  console.error('failed to fire trigger', err)
})
```

### create action from source file

```
const name = 'reverseWords'
const action = fs.readFileSync('source.js', {encoding: 'utf8'})

ow.actions.create({name, action}).then(result => {
  console.log('action created!')
}).catch(err => {
  console.error('failed to create action', err)
})
```

### create action from zip package

```
const name = 'reverseWords'
const action = fs.readFileSync('package.zip')

ow.actions.create({name, action}).then(result => {
  console.log('action created!')
}).catch(err => {
  console.error('failed to create action', err)
})
```

### retrieve action resource

```
const name = 'reverseWords'
ow.actions.retrieve({name}).then(action => {
  console.log('action resource', action)
}).catch(err => {
  console.error('failed to retrieve action', err)
})
```

### chaining calls

```
ow.actions.list()
  .then(actions => ow.actions.invoke(actions))
  .then(result => ...)
```

### list packages

```
ow.packages.list().then(packages => {
  packages.forEach(package => console.log(package.name))
}).catch(err => {
  console.error('failed to list packages', err)
})
```

### update package parameters

```
const name = 'myPackage'
const package = {
  parameters: [
    {key: "colour", value: "green"},
    {key: "name", value: "Freya"}
  ]
}

ow.packages.update({name, package}).then(package => {
  console.log('updated package:', package.name)
}).catch(err => {
  console.error('failed to update package', err)
})
```

### create trigger feed from alarm package

```
// alarmTrigger MUST already exist in default namespace
const params = {cron: '*/8 * * * * *', trigger_payload: {name: 'James'}}
const name = '/whisk.system/alarms/alarm'
const trigger = 'alarmTrigger'
ow.feeds.create({name, trigger, params}).then(package => {
  console.log('alarm trigger feed created')
}).catch(err => {
  console.error('failed to create alarm trigger', err)
})
```



## API Details

### resource identifiers + namespaces

When passing resource identifiers as parameters you can either use a short name, without an explicit namespace, or a fully-qualified identifier, including namespace and package details.

If the namespace is missing from the resource identifier, the client will use the namespace from configuration options following this ordering.

- `namespace` from method parameter options OR
- `namespace` from options passed into client constructor OR
- `namespace` from environment variable (`__OW_NAMESPACE`) OR
- default namespace: `_`

### list resources

```
ow.actions.list()
ow.activations.list()
ow.triggers.list()
ow.rules.list()
ow.namespaces.list()
ow.packages.list()
```

Query parameters for the API calls are supported (e.g. limit, skip, etc.) by passing an object with the named parameters as the first argument.

```
ow.actions.list({skip: 100, limit: 50})
```

The following optional parameters are supported:
- `namespace` - set custom namespace for endpoint

### retrieve resource

```
ow.actions.get({name: '...'})
ow.activations.get({name: '...'})
ow.triggers.get({name: '...'})
ow.rules.get({name: '...'})
ow.namespaces.get({name: '...'})
ow.packages.get({name: '...'})
```

The following optional parameters are supported:
- `namespace` - set custom namespace for endpoint

This method also supports passing the `name` property directly without wrapping within an object.

```
const name = "actionName"
ow.actions.get(name)
```

If you pass in an array for the first parameter, the `get` call will be executed for each array item. The function returns a Promise which resolves with the results when all operations have finished.

```
ow.actions.get(["a", {name: "b"}])
```

### delete resource

```
ow.actions.delete({name: '...'})
ow.triggers.delete({name: '...'})
ow.rules.delete({name: '...'})
ow.packages.delete({name: '...'})
```

The following optional parameters are supported:
- `namespace` - set custom namespace for endpoint

This method also supports passing the `name` property directly without wrapping within an object.

```
const name = "actionName"
ow.actions.delete(name)
```

If you pass in an array for the first parameter, the `delete` call will be executed for each array item. The function returns a Promise which resolves with the results when all operations have finished.

```
ow.actions.delete(["a", {name: "b"}])
```

### invoke action

```
ow.actions.invoke({name: '...'})
```

The `actionName` parameter supports the following formats: `actionName`, `package/actionName`, `/namespace/actionName`, `/namespace/package/actionName`.

If `actionName` includes a namespace, this overrides any other `namespace` properties.

The following optional parameters are supported:
- `blocking` - delay returning until action has finished executing (default: `false`)
- `result` - return function result (`obj.response.result`) rather than entire API result (default: `false`)
- `params` - JSON object containing parameters for the action being invoked (default: `{}`)
- `namespace` - set custom namespace for endpoint

This method also supports passing the `name` property directly without wrapping within an object.

```
const name = "actionName"
ow.actions.invoke(name)
```

If you pass in an array for the first parameter, the `invoke` call will be executed for each array item. The function returns a Promise which resolves with the results when all operations have finished.

```
ow.actions.invoke(["a", {name: "b", blocking: true}])
```

### create & update action

```
ow.actions.create({name: '...', action: 'function main() {};'})
ow.actions.update({name: '...', action: 'function main() {};'})
```

The following mandatory parameters are supported:
- `name` - action identifier
- `action` - String containing JS function source code, Buffer [containing package action zip file](https://github.com/openwhisk/openwhisk/blob/master/docs/actions.md#packaging-an-action-as-a-nodejs-module) or JSON object containing full parameters for the action body

The following optional parameters are supported:
- `namespace` - set custom namespace for endpoint
- `params` - object containing default parameters for the action (default: `{}`)
- `kind` - runtime environment parameter, ignored when `action` is an object (default: `nodejs:default`)

If you pass in an array for the first parameter, the `create` call will be executed for each array item. The function returns a Promise which resolves with the results when all operations have finished.

```
ow.actions.create([{...}, {...}])
```

### fire trigger

```
ow.triggers.invoke({name: '...'})
```

The following optional parameters are supported:
- `params` - JSON object containing parameters for the trigger being fired (default: `{}`)
- `namespace` - set custom namespace for endpoint

This method also supports passing the `name` property directly without wrapping within an object.

```
const name = "actionName"
ow.triggers.invoke(name)
```

If you pass in an array for the first parameter, the `invoke` call will be executed for each array item. The function returns a Promise which resolves with the results when all operations have finished.

```
ow.triggers.invoke(["a", {name: "b", blocking: true}])
```

### create & update trigger

```
ow.triggers.create({name: '...'})
ow.triggers.update({name: '...'})
```

The following optional parameters are supported:
- `trigger` - JSON object containing parameters for the trigger body (default: `{}`)
- `namespace` - set custom namespace for endpoint

### create & update packages

```
ow.packages.create({name: '...'})
ow.packages.update({name: '...'})
```

The following optional parameters are supported:
- `package` - JSON object containing parameters for the package body (default: `{}`)
- `namespace` - set custom namespace for endpoint

### create & update rule

```
ow.rules.create({name: '...', action: '...', trigger: '...'})
ow.rules.update({name: '...', action: '...', trigger: '...'})
```

`trigger` and `action` identifiers will have the default namespace (`/_/`)
appended in the request, unless a fully qualified name is passed in
(`/custom_ns/action_or_trigger_name`).

The following optional parameters are supported:
- `namespace` - set namespace for rule

### enable & disable rule

```
ow.rules.enable({name: '...'})
ow.rules.disable({name: '...'})
```

The following optional parameters are supported:
- `namespace` - set custom namespace for endpoint

### create & delete feeds

```
ow.feeds.create({feedName: '...', trigger: '...'})
ow.feeds.delete({feedName: '...', trigger: '...'})
```

The following optional parameters are supported:
- `namespace` - set custom namespace for endpoint
- `params` - JSON object containing parameters for the feed being invoked (default: `{}`)

## api gateway

OpenWhisk supports a [built-in API gateway service](https://github.com/apache/incubator-openwhisk/blob/master/docs/apigateway.md) and external third-party providers.

This client library defaults to using the platform service. If the `apigw_token` parameter is passed into the client constructor, the implementation will switch to the [IBM Bluemix API Gateway](https://console.ng.bluemix.net/docs/openwhisk/openwhisk_apigateway.html#openwhisk_apigateway).

*The interface for managing routes through the library does not change between providers.*

### list routes

```
ow.routes.list()
```

The following optional parameters are supported to filter the result set:
- `relpath` - relative URI path for endpoints
- `basepath` - base URI path for endpoints
- `operation` - HTTP methods
- `limit` - limit result set size
- `skip` - skip results from index

*`relpath` is only valid when `basepath` is also specified.*

### delete routes

```
ow.routes.delete({basepath: '...'})
```

The following optional parameters are supported to filter the result set:
- `relpath` - relative URI path for endpoints
- `operation` - HTTP methods

### add route
```
ow.routes.create({relpath: '...', operation: '...', action: '...'})
```

*`action` supports normal (actionName) and fully-qualified (/namespace/actionName) formats.*

The following optional parameters are supported to filter the result set:
- `basepath` - base URI path for endpoints (default: `/`)

## Debugging

Setting an environment parameter (`NODE_DEBUG=request`) will dump the HTTP requests from the client library and responses received to `stderr`.

```
NODE_DEBUG=request node script.js
```

This parameter can also be set dynamically at runtime, provided this happens before the `openwhisk` module is required.

```
process.env.NODE_DEBUG='request';
var openwhisk = require('openwhisk');
```

## Development

### unit tests

```
npm test
```

### integration tests

*Please [see the instructions](https://github.com/openwhisk/openwhisk-client-js/tree/master/test/integration) for setting up the integration test environment prior to running these tests.*

```
npm run-script test-integration
```

**Note:** The test integration runs in secure mode by default, which means that all trusted signers must be present and available to the client process.
If your local environment is using self-signed certificates, you can use the following command to start the script in insecure mode:

`npm run test-integration -i`

This will disable SSL/TLS verification for all SSL communication.

Alternatively, you can run the `prepIntegrationTests.sh` script using guest credentials or by specifying specific credentials.  
Run the script with guest credentials:  
```
./test/integration/prepIntegrationTests.sh guest
```  
Run the script with specific credentials:  
```
./test/integration/prepIntegrationTests.sh <your key in the form of ABCD:EFGH> <openwhisk instance hostname> <openwhisk namespace> <api gatewaytoken>
```  
The `prepIntegrationTests.sh` script is designed to give you feedback if it detects a setting that is not correct on your machine. ex: `node 6 is not detected`

# openwhisk-client-js

JavaScript client library for the [OpenWhisk](https://github.com/openwhisk/openwhisk) platform.
Provides a wrapper around the [OpenWhisk APIs](https://new-console.ng.bluemix.net/apidocs/98#introduction).

## installation

```
$ npm install openwhisk
```

## usage

```
var openwhisk = require('openwhisk');
var options = {apihost: 'openwhisk.ng.bluemix.net', api_key: '...', namespace: 'my_namespace'};
var ow = openwhisk(options);
```

_Client constructor supports the following options:_
- **apihost.** Hostname and optional port for openwhisk platform, e.g. `openwhisk.ng.bluemix.net` or `my_whisk_host:80`. Used with API URL template `${protocol}://${apihost}/api/v1/`. If port is missing or port value is 443 in the apihost string, protocol is HTTPS. Otherwise, protocol is HTTP.
- **api.** Full API URL for OpenWhisk platform, e.g. `https://openwhisk.ng.bluemix.net/api/v1/`. This value overrides `apihost` if both are present.
- **api_key.** Authorisation key for user account registered with OpenWhisk platform.
- **namespace**. Default namespace for resource requests.
- **ignore_certs**. Turns off server SSL/TLS certificate verification. This allows the client to be used against local deployments of OpenWhisk with a self-signed certificate. Defaults to false.

*Client constructor will read values for the `apihost`, `namespace` and `api_key` options from the environment if the following parameters are set. Explicit parameter values override these values.*
- __OW_API_HOST, __OW_NAMESPACE and __OW_API_KEY.

_All methods return a Promise resolved asynchronously with the results. Failures are available through the catch method._

```
ow.resource.operation().then(function () { // success! }).catch(function (err) { // failed! })
```

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
ow.actions.get({actionName: '...'})
ow.activations.get({activation: '...'})
ow.triggers.get({triggerName: '...'})
ow.rules.get({ruleName: '...'})
ow.namespaces.get({namespace: '...'})
ow.packages.get({packageName: '...'})
```

The following optional parameters are supported:
- `namespace` - set custom namespace for endpoint

### delete resource 

```
ow.actions.delete({actionName: '...'})
ow.triggers.delete({triggerName: '...'})
ow.rules.delete({ruleName: '...'})
ow.packages.delete({packageName: '...'})
```

The following optional parameters are supported:
- `namespace` - set custom namespace for endpoint

### invoke action

```
ow.actions.invoke({actionName: '...'})
```

The `actionName` parameter supports the following formats: `actionName`, `package/actionName`, `/namespace/actionName`, `/namespace/package/actionName`.

If `actionName` includes a namespace, this overrides any other `namespace` properties.

The following optional parameters are supported:
- `blocking` - delay returning until action has finished executing (default: `false`)
- `params` - JSON object containing parameters for the action being invoked (default: `{}`)
- `namespace` - set custom namespace for endpoint

### create & update action

```
ow.actions.create({actionName: '...', action: 'function main() {};'})
ow.actions.update({actionName: '...', action: 'function main() {};'})
```

The following mandatory parameters are supported:
- `actionName` - action identifier
- `action` - String containing JS function source code, Buffer [containing package action zip file](https://github.com/openwhisk/openwhisk/blob/master/docs/actions.md#packaging-an-action-as-a-nodejs-module) or JSON object containing full parameters for the action body 

The following optional parameters are supported:
- `namespace` - set custom namespace for endpoint

### fire trigger

```
ow.triggers.invoke({triggerName: '...'})
```

The following optional parameters are supported:
- `params` - JSON object containing parameters for the trigger being fired (default: `{}`)
- `namespace` - set custom namespace for endpoint

### create & update trigger

```
ow.triggers.create({triggerName: '...'})
ow.triggers.update({triggerName: '...'})
```

The following optional parameters are supported:
- `trigger` - JSON object containing parameters for the trigger body (default: `{}`)
- `namespace` - set custom namespace for endpoint

### create & update packages

```
ow.packages.create({packageName: '...'})
ow.packages.update({packageName: '...'})
```

The following optional parameters are supported:
- `package` - JSON object containing parameters for the package body (default: `{}`)
- `namespace` - set custom namespace for endpoint

### create & update rule

```
ow.rules.create({ruleName: '...', action: '...', trigger: '...'})
ow.rules.update({ruleName: '...', action: '...', trigger: '...'})
```

The following optional parameters are supported:
- `namespace` - set custom namespace for endpoint

### enable & disable rule

```
ow.rules.enable({ruleName: '...'})
ow.rules.disable({ruleName: '...'})
```

The following optional parameters are supported:
- `namespace` - set custom namespace for endpoint

### create & delete feeds

```
ow.feeds.create({feedName: '...', trigger: '...'})
ow.feeds.delete({feedName: '...', trigger: '...'})

// for example... 
const params = {cron: '*/8 * * * * *', trigger_payload: {name: 'James'}}
ow.feeds.create({feedName: 'alarms/alarm', namespace: 'whisk.system', trigger: 'alarmTrigger', params})
```

The following optional parameters are supported:
- `namespace` - set custom namespace for endpoint
- `params` - JSON object containing parameters for the feed being invoked (default: `{}`)

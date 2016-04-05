# openwhisk-client-js

JavaScript client library for the [OpenWhisk](https://github.com/openwhisk/openwhisk) platform.
Provides a wrapper around the [OpenWhisk APIs](https://new-console.ng.bluemix.net/apidocs/98#introduction).

## installation

```
$ npm install openwhisk // replace with package name....
```

## usage

```
var openwhisk = require('openwhisk');
var ow = openwhisk('https://openwhisk.ng.bluemix.net/api/v1/', 'api_key', {namespace: 'default_namespace'});
```

_All resource operation methods return a Promise resolved asynchronously with the results. Failures are available through the catch method._

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

The following optional parameters are supported:
- `blocking` - delay returning until action has finished executing (default: `false`)
- `params` - JSON object containing parameters for the action being invoked (default: `{}`)
- `namespace` - set custom namespace for endpoint

### create & update action

```
ow.actions.create({actionName: '...'})
ow.actions.update({actionName: '...'})
```

The following optional parameters are supported:
- `action` - JSON object containing parameters for the action body (default: `{}`)
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

// Licensed to the Apache Software Foundation (ASF) under one or more contributor
// license agreements; and to You under the Apache License, Version 2.0.

const Actions = require('./actions.js')
const Activations = require('./activations.js')
const Namespaces = require('./namespaces.js')
const Packages = require('./packages.js')
const Rules = require('./rules.js')
const Triggers = require('./triggers.js')
const Feeds = require('./feeds.js')
const Routes = require('./routes.js')
const Client = require('./client.js')

const OpenWhisk = (options) => {
  const client = new Client(options)
  return {
    actions: new Actions(client),
    activations: new Activations(client),
    namespaces: new Namespaces(client),
    packages: new Packages(client),
    rules: new Rules(client),
    triggers: new Triggers(client),
    feeds: new Feeds(client),
    routes: new Routes(client)
  }
}

module.exports = OpenWhisk

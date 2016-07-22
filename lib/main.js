const Actions = require('./actions.js')
const Activations = require('./activations.js')
const Namespaces = require('./namespaces.js')
const Packages = require('./packages.js')
const Rules = require('./rules.js')
const Triggers = require('./triggers.js')
const Feeds = require('./feeds.js')

const OpenWhisk = (options) => {
  return {
    actions: new Actions(options),
    activations: new Activations(options),
    namespaces: new Namespaces(options),
    packages: new Packages(options),
    rules: new Rules(options),
    triggers: new Triggers(options),
    feeds: new Feeds(options)
  }
}

module.exports = OpenWhisk

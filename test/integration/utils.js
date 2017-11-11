function getInsecureFlag () {
  let npmConfigArgObj = process.env.npm_config_argv ? JSON.parse(process.env.npm_config_argv) : null
  if (npmConfigArgObj) {
    return npmConfigArgObj.original && npmConfigArgObj.original[2] === '-i'
  }
  return false
}

function autoOptions () {
  var options = {}
  if (getInsecureFlag()) {
    options.ignoreCerts = true
    options.apigwToken = true
  }
  return options
}

module.exports = {
  getInsecureFlag: getInsecureFlag,
  autoOptions: autoOptions
}

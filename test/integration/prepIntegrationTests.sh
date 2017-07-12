#!/bin/bash
#Usage: ./test/integration/prepIntegrationTests.sh <yourapikeyintheformofABCD:EFGH> <openwhis hostname> <openwhisk namespace> <api gatewaytoken>
# Run from the incubator-openwhisk-client-js

# Make sure wsk is installed; exit if wsk is not available.
if ! type "wsk" > /dev/null; then
  echo "Exiting program; wsk is not installed on the system. Cannot preform tests"
  exit 1
fi

# Assert NODEJS6/NPM3 is default
if [[ ! $(node --version) =~ v6.[0-9]*.[0-9]* ]]; then
  echo "Exiting program; npm 6 not detected"
  exit 1
fi

# Allow user to specify key, host, namespace, or token
override_key="$1"
override_host="$2"
override_namespace="$3"
override_token="$4"
iflag=""
kflag=""

function getvalue {
  content="$1"
  search="$2"
  result="$3"
  result=$(echo "$content" | grep "$search" | awk '{print $NF}')
  return 0
}

if [ $override_key == "guest" ]; then
  echo "getting guest user credentials"
  iflag="-i"
  kflag="-k"
  propInfo=$(wsk -i property get)
  getvalue "$propInfo" "whisk auth" "$result"
  override_key="$result"
  getvalue "$propInfo" "whisk API host" "$result"
  override_host="$result"
  #getvalue "$propInfo" "whisk namespace" "$result"
  #override_namespace="$result"
  override_namespace="guest"
  override_token=""

  #echo "override_key: $override_key"
  #echo "override_host: $override_host"
  #echo "override_namespace: $override_namespace"
fi


#If they exist, export these values (tests use a global)
if [ -n "$override_key" ] && [ -n "$override_host" ] && [ -n "$override_namespace" ] ; then
  echo "found key, host, namespace and token"
  export __OW_API_KEY="$override_key"
  export __OW_API_HOST="$override_host"
  export __OW_NAMESPACE="$override_namespace"
  export __OW_APIGW_TOKEN="$override_token"
else
  echo "Exiting program; Missing one or more of the arguments:  key, host, namespace, or token. Specified in the format: ./prepIntegrationTests.sh <yourapikey> <openwhis hostname> <openwhisk namespace> <api gatewaytoken>";
  echo "TODO: implement script to get ~/.wskprops and grep it for key, host, namespace, and token."
  exit 1;
fi

#verify credentials are acceptable:
credentialsCheck=$( echo no | curl -s $kflag -u $__OW_API_KEY https://$__OW_API_HOST/api/v1/namespaces )
credentialError=$(jq -r ".error" <<< $credentialsCheck &>/dev/null)
if [[ $PIPESTATUS -eq 0 ]]; then
  echo "Exiting program; There is an error with your username:password credentials: $__OW_API_KEY for accesssing the host $__OW_API_HOST";
  exit 1;
fi


# make temporary files so that we can use the wsk cli to create actions and triggers.
# in the instructions the contests of hello and tests are identical so we only make 1 version of the file, and then just create two actions from it.
mkdir temp
touch temp/tests.js
touch temp/resourceExists
touch temp/resourceError
echo "function main() {return {payload: 'Hello world'};}" > temp/tests.js

wsk $iflag action update hello temp/tests.js
wsk $iflag action update tests temp/tests.js
wsk $iflag trigger update sample

#run tests
npm run test-integration $iflag

#cleanup resources that may or may not exist. Hide stdout/stderr
function cleanresources {
  verb="$1"
  name="$2"
  wsk $iflag $verb get $name -s &>/dev/null
  if [[ $PIPESTATUS -eq 0 ]]; then
    wsk $iflag $verb delete $name
  fi
}

#clean up artifacts generated during a bad-testRun
cleanresources action routeAction
cleanresources action random_package_action_test
cleanresources action random_action_test
cleanresources action random_action_params_test
cleanresources action random_update_tested
cleanresources trigger sample_feed_trigger
cleanresources trigger sample_rule_trigger
cleanresources trigger random_trigger_test
cleanresources rule random_rule_test
#wsk api delete /testing

#cleanup workspace
rm -rf temp
wsk $iflag action delete hello
wsk $iflag action delete tests
wsk $iflag trigger delete sample

echo "script finished"

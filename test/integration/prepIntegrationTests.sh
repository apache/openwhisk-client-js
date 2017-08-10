#!/bin/bash
#set -e
#Usage: ./test/integration/prepIntegrationTests.sh <yourapikeyintheformofABCD:EFGH> <openwhis hostname> <openwhisk namespace> <api gatewaytoken> <optional "insecure">
# Run from the incubator-openwhisk-client-js

# Assert NODEJS6/NPM3 or greater is default node/npm version
NODE_VERSION_MAJOR=`node --version | awk -Fv '{print $2}' | awk -F. '{print $1}'`
if [ ${NODE_VERSION_MAJOR} -lt 6 ]; then
  echo "Exiting program; node less than version 6 detected"
  exit 1
fi

# Allow user to specify key, host, namespace, or token
override_key="$1"
override_host="$2"
override_namespace="$3"
override_token="$4"
insecurecred="$5"
iflag=""
kflag=""

if [ $insecurecred == "insecure" ]; then
  echo "INSECURE MODE!"
  iflag="-i"
  kflag="-k"
  override_namespace="guest"
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
echo "Checking credentials"
credentialsCheck=$( echo no | curl -s $kflag -u $__OW_API_KEY https://$__OW_API_HOST/api/v1/namespaces )
credentialError=$(jq -r ".error" <<< $credentialsCheck &>/dev/null)
if [[ $PIPESTATUS -eq 0 ]]; then
  echo "Exiting program; There is an error with your username:password credentials: $__OW_API_KEY for accesssing the host $__OW_API_HOST";
  exit 1;
fi


# make temporary files so that we can use the wsk cli to create actions and triggers.
# in the instructions the contests of hello and tests are identical so we only make 1 version of the file, and then just create two actions from it.
echo "Make temporary resource files"
mkdir temp
touch temp/tests.js
echo "function main() {return {payload: 'Hello world'};}" > temp/tests.js

echo "Create wsk actions and triggers for use by tests"
curl -s --output /dev/null $kflag -u $__OW_API_KEY  -d '{"namespace":"'"$__OW_NAMESPACE"'","name":"hello","exec":{"kind":"nodejs:6","code":"function main() { return {payload:\"Hello world\"}}"}}' -X PUT -H "Content-Type: application/json" https://$__OW_API_HOST/api/v1/namespaces/$__OW_NAMESPACE/actions/hello?overwrite=true
curl -s --output /dev/null $kflag -u $__OW_API_KEY  -d '{"namespace":"'"$__OW_NAMESPACE"'","name":"tests","exec":{"kind":"nodejs:6","code":"function main() { return {payload:\"Hello world\"}}"}}' -X PUT -H "Content-Type: application/json" https://$__OW_API_HOST/api/v1/namespaces/$__OW_NAMESPACE/actions/tests?overwrite=true
curl -s --output /dev/null $kflag -u $__OW_API_KEY -d '{"name":"sample"}' -X PUT -H "Content-Type: application/json"  https://192.168.99.100/api/v1/namespaces/_/triggers/sample?overwrite=true

#run tests
echo "running tests"
npm run test-integration $iflag
RUNSTAT=$PIPESTATUS

#cleanup resources that may or may not exist. Hide stdout/stderr
function cleanresources {
  verb="$1"
  name="$2"

  curlstatus=$(curl -s -i $kflag -u $__OW_API_KEY -X GET -H "Content-Type: application/json" https://$__OW_API_HOST/api/v1/namespaces/$__OW_NAMESPACE/$verb/$name)
  statusheader=$(echo "$curlstatus" | awk 'NR==1{print $0; exit}')
  if [[ $statusheader == *"200"* ]]; then
    echo "200 status code found; now deleteing"
    curl -s -i $kflag -u $__OW_API_KEY -X DELETE -H "Content-Type: application/json" https://$__OW_API_HOST/api/v1/namespaces/$__OW_NAMESPACE/$verb/$name
  fi
}

#clean up artifacts generated during a bad-testRun
echo "clean resources"
cleanresources actions routeAction
cleanresources actions random_package_action_test
cleanresources actions random_action_test
cleanresources actions random_action_params_test
cleanresources actions random_update_tested
cleanresources triggers sample_feed_trigger
cleanresources triggers sample_rule_trigger
cleanresources triggers random_trigger_test
cleanresources rules random_rule_test

#cleanup workspace
rm -rf temp
curl -s --output /dev/null $kflag -u $__OW_API_KEY -X DELETE -H "Content-Type: application/json" https://$__OW_API_HOST/api/v1/namespaces/$__OW_NAMESPACE/actions/hello
curl -s --output /dev/null $kflag -u $__OW_API_KEY -X DELETE -H "Content-Type: application/json" https://$__OW_API_HOST/api/v1/namespaces/$__OW_NAMESPACE/actions/tests
curl -s --output /dev/null $kflag -u $__OW_API_KEY -X DELETE -H "Content-Type: application/json" https://$__OW_API_HOST/api/v1/namespaces/$__OW_NAMESPACE/triggers/sample

echo "script finished"

exit $RUNSTAT

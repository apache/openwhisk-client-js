#!/bin/bash
key="$1"
host="$2"
namespace="$3"
token="$4"
runningEnv="$5"
insecure=""

if [[ "$runningEnv" == *"insecure"* ]] ; then
  insecure="insecure"
fi


tempDir="coveragetemp"
mkdir $tempDir
mkdir $tempDir/unit
mkdir $tempDir/integration

#Create json coverage items for unit and integration tests
node ./node_modules/nyc/bin/nyc.js ava test/unit
unitstatus="$PIPESTATUS"
mv .nyc_output/* $tempDir/unit

node ./node_modules/nyc/bin/nyc.js ./test/integration/prepIntegrationTests.sh $key $host $namespace $token $insecure
integrationstatus="$PIPESTATUS"
mv .nyc_output/* $tempDir/integration

#move merged json back and delete temporary folder
cp -a $tempDir/unit/. .nyc_output
cp -a $tempDir/integration/. .nyc_output
rm -rf $tempDir

# generate the HTML report from the merged results
if [[ "$runningEnv" == *"travis"* ]] ; then
  npm run coverage
fi

node ./node_modules/nyc/bin/nyc.js report --reporter=html


if [ "$unitstatus" = "0" ] && [ "$integrationstatus" = "0" ] ; then
    exit 0
else
    echo "one or more of either the unit tests or integration tests failed: unit status: $unitstatus; integration status: $integrationstatus;"
    exit 1
fi

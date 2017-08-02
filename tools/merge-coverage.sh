#!/bin/bash
tempDir="coveragetemp"
mkdir $tempDir
mkdir $tempDir/unit
mkdir $tempDir/integration

#Create json coverage items for unit and integration tests
node ./node_modules/nyc/bin/nyc.js ava test/unit
mv .nyc_output/* $tempDir/unit

node ./node_modules/nyc/bin/nyc.js ./test/integration/prepIntegrationTests.sh guest
mv .nyc_output/* $tempDir/integration

#move merged json back and delete temporary folder
cp -a $tempDir/unit/. .nyc_output
cp -a $tempDir/integration/. .nyc_output
rm -rf $tempDir

# generate the HTML report from the merged results
node ./node_modules/nyc/bin/nyc.js report --reporter=html

#!/bin/bash
set -e

# Build script for Travis-CI.

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
ROOTDIR="$SCRIPTDIR/../.."
WHISKDIR="$ROOTDIR/../openwhisk"

# Install OpenWhisk
cd $WHISKDIR/ansible

ANSIBLE_CMD="ansible-playbook -i environments/local -e docker_image_prefix=openwhisk"

$ANSIBLE_CMD setup.yml
$ANSIBLE_CMD prereq.yml
$ANSIBLE_CMD couchdb.yml
$ANSIBLE_CMD initdb.yml
$ANSIBLE_CMD apigateway.yml

cd $WHISKDIR
./gradlew :tools:cli:distDocker -PdockerImagePrefix=openwhisk

cd $WHISKDIR/ansible

$ANSIBLE_CMD wipe.yml
$ANSIBLE_CMD openwhisk.yml
$ANSIBLE_CMD postdeploy.yml

cd $WHISKDIR
cat whisk.properties

# Set Environment
export OPENWHISK_HOME=$WHISKDIR

# Set up CLI tool used by prereq script
sudo cp $WHISKDIR/bin/wsk /usr/bin/wsk

edgehost=$(cat $WHISKDIR/whisk.properties | grep edge.host= | sed s/edge\.host=//)
wsk property set --apihost $edgehost
wsk property set --auth "$(cat $WHISKDIR/ansible/files/auth.guest)"

# Test
cd $ROOTDIR
npm install
./test/integration/prepIntegrationTests.sh guest

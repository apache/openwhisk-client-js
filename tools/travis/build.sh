#!/bin/bash
set -e
#
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#


# Build script for Travis-CI.

SCRIPTDIR=$(cd $(dirname "$0") && pwd)
ROOTDIR="$SCRIPTDIR/../.."
WHISKDIR="$ROOTDIR/../openwhisk"

# Install OpenWhisk
cd $WHISKDIR/ansible

ANSIBLE_CMD="ansible-playbook -i environments/local -e docker_image_prefix=openwhisk -e docker_image_tag=nightly"

$ANSIBLE_CMD setup.yml
$ANSIBLE_CMD prereq.yml
$ANSIBLE_CMD couchdb.yml
$ANSIBLE_CMD initdb.yml

cd $WHISKDIR
 ./gradlew  -PdockerImagePrefix=openwhisk
cd $WHISKDIR/ansible

$ANSIBLE_CMD wipe.yml
$ANSIBLE_CMD openwhisk.yml  -e '{"openwhisk_cli":{"installation_mode":"remote","remote":{"name":"OpenWhisk_CLI","dest_name":"OpenWhisk_CLI","location":"https://github.com/apache/openwhisk-cli/releases/download/latest"}}}'
$ANSIBLE_CMD apigateway.yml
$ANSIBLE_CMD properties.yml # required for to run before routemgmt.yml
$ANSIBLE_CMD routemgmt.yml
$ANSIBLE_CMD postdeploy.yml

cd $WHISKDIR
cat whisk.properties

edgehost=$(cat $WHISKDIR/whisk.properties | grep edge.host= | sed s/edge\.host=//)
key=$(cat $WHISKDIR/ansible/files/auth.guest)

# Test
cd $ROOTDIR
npm ci
npm run lint

npm run check-deps-size
npm run coverage:unit

# integration test parameters
export __OW_API_KEY="$key"
export __OW_API_HOST="$edgehost"
export __OW_NAMESPACE="guest"
export __OW_APIGW_TOKEN="true"
export __OW_INSECURE="true"

npm run coverage:integration
npm run coverage:report
npm run coverage:upload

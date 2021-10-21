#!/bin/bash
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

set -ue

if [ -z "$1" ]
  then
    echo "Missing maximum size argument (kilobytes)"
fi

echo "Checking node_modules size isn't more than threshold (kb): $1"

UNPACK_DIR=$(mktemp -d)
npm pack -q

cp openwhisk-*.tgz $UNPACK_DIR
cd $UNPACK_DIR

tar -xzf openwhisk-*.tgz
cd package
npm install --only=production --silent
cd node_modules
NODE_MODULES_SIZE=$(du  -ks | cut -f 1)

if [ "$NODE_MODULES_SIZE" -gt "$1" ]; then
  echo "failure! node_modules size ($NODE_MODULES_SIZE) is more than threshold"
  exit 1
else
  echo "success! node_modules size ($NODE_MODULES_SIZE) is less than threshold"
fi

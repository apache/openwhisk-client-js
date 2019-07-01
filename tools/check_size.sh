#!/bin/sh

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
npm install --production --silent
cd node_modules
NODE_MODULES_SIZE=$(du  -ks | cut -f 1)

if [ "$NODE_MODULES_SIZE" -gt "$1" ]; then
  echo "failure! node_modules size ($NODE_MODULES_SIZE) is more than threshold"
  exit 1
else
  echo "success! node_modules size ($NODE_MODULES_SIZE) is less than threshold"
fi

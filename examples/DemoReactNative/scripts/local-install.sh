#!/bin/bash

# Normally you should be able to do this by specifying 'file:../..' in the package.json
# but this was causing weird and vague errors in the project.
# So we're doing it manually here. Ideally this should go away at some point.

if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Usage: $0 LIB_PATH LIB_NAME"
  exit 1
fi

LIB_PATH=$(realpath "$1")
LIB_NAME=$2
DEMO_REACT_NATIVE_PATH=$(pwd)

echo "Installing $LIB_NAME from $LIB_PATH"

echo "Remove node_modules/$LIB_NAME"
rm -rf "$DEMO_REACT_NATIVE_PATH/node_modules/$LIB_NAME"

echo "Run npm pack to create production build"
cd "$LIB_PATH" || exit
yarn build
npm pack --quiet

# find the ${LIB_NAME}-<version>.tgz file
TGZ_NAME=$(find . -name "${LIB_NAME}-*.tgz" | head -n 1)
# verify that the file exists
if [ ! -f "$TGZ_NAME" ]; then
  echo "Could not find $LIB_NAME-*.tgz file"
  exit 1
fi


echo "Unpack $LIB_NAME tarball to $DEMO_REACT_NATIVE_PATH/node_modules"
tar -xvzf "$TGZ_NAME" -C "$DEMO_REACT_NATIVE_PATH/node_modules"

echo "Remove $TGZ_NAME file"
rm "$TGZ_NAME"

echo "move $DEMO_REACT_NATIVE_PATH/node_modules/package to $DEMO_REACT_NATIVE_PATH/node_modules/$LIB_NAME"
mv "$DEMO_REACT_NATIVE_PATH/node_modules/package" "$DEMO_REACT_NATIVE_PATH/node_modules/$LIB_NAME"

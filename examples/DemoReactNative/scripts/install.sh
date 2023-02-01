#!/bin/bash

# Normally you should be able to do this by specifying 'file:../..' in the package.json
# but this was causing weird and vague errors in the DemoReactNative project.
# So we're doing it manually here. Ideally this should go away at some point.

REACTOTRON_REACT_NATIVE_PATH=$(realpath "$(pwd)/../../lib/reactotron-react-native")
DEMO_REACT_NATIVE_PATH=$(pwd)

echo "Installing reactotron-react-native from $REACTOTRON_REACT_NATIVE_PATH"

echo "Remove node_modules/reactotron-react-native"
rm -rf "$DEMO_REACT_NATIVE_PATH/node_modules/reactotron-react-native"

echo "Run npm pack to create production build"
cd "$REACTOTRON_REACT_NATIVE_PATH" || exit
yarn build
npm pack --quiet

# find the reactotron-react-native-<version>.tgz file
REACTOTRON_REACT_NATIVE_TGZ=$(find . -name "reactotron-react-native-*.tgz" | head -n 1)
# verify that the file exists
if [ ! -f "$REACTOTRON_REACT_NATIVE_TGZ" ]; then
  echo "Could not find reactotron-react-native-*.tgz file"
  exit 1
fi


echo "Unpack reactotron-react-native tarball to $DEMO_REACT_NATIVE_PATH/node_modules"
tar -xvzf "$REACTOTRON_REACT_NATIVE_TGZ" -C "$DEMO_REACT_NATIVE_PATH/node_modules"

echo "Remove reactotron-react-native-*.tgz file"
rm "$REACTOTRON_REACT_NATIVE_TGZ"

echo "move $DEMO_REACT_NATIVE_PATH/node_modules/package to $DEMO_REACT_NATIVE_PATH/node_modules/reactotron-react-native"
mv "$DEMO_REACT_NATIVE_PATH/node_modules/package" "$DEMO_REACT_NATIVE_PATH/node_modules/reactotron-react-native"

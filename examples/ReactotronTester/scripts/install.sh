#!/bin/bash

# Normally you should be able to do this by specifying 'file:../..' in the package.json
# but this was causing weird and vague errors in the ReactotronTestser project.
# So we're doing it manually here. Ideally this should go away at some point.

REACTOTRON_MST_PATH=$(realpath "$(pwd)/../../lib/reactotron-mst")
DEMO_REACT_NATIVE_PATH=$(pwd)

echo "Installing reactotron-mst from $REACTOTRON_MST_PATH"

echo "Remove node_modules/reactotron-mst"
rm -rf "$DEMO_REACT_NATIVE_PATH/node_modules/reactotron-mst"

echo "Run npm pack to create production build"
cd "$REACTOTRON_MST_PATH" || exit
yarn build
npm pack --quiet

# find the reactotron-mst-<version>.tgz file
REACTOTRON_REACT_NATIVE_TGZ=$(find . -name "reactotron-mst-*.tgz" | head -n 1)
# verify that the file exists
if [ ! -f "$REACTOTRON_REACT_NATIVE_TGZ" ]; then
  echo "Could not find reactotron-mst-*.tgz file"
  exit 1
fi


echo "Unpack reactotron-mst tarball to $DEMO_REACT_NATIVE_PATH/node_modules"
tar -xvzf "$REACTOTRON_REACT_NATIVE_TGZ" -C "$DEMO_REACT_NATIVE_PATH/node_modules"

echo "Remove reactotron-mst-*.tgz file"
rm "$REACTOTRON_REACT_NATIVE_TGZ"

echo "move $DEMO_REACT_NATIVE_PATH/node_modules/package to $DEMO_REACT_NATIVE_PATH/node_modules/reactotron-mst"
mv "$DEMO_REACT_NATIVE_PATH/node_modules/package" "$DEMO_REACT_NATIVE_PATH/node_modules/reactotron-mst"

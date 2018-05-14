#!/bin/bash

# rebuild
./node_modules/.bin/lerna run build --scope reactotron-core-client --scope reactotron-react-native

# copies
cp -r packages/reactotron-core-client/dist/* $1/node_modules/reactotron-core-client/dist/
cp -r packages/reactotron-react-native/dist/* $1/node_modules/reactotron-react-native/dist/

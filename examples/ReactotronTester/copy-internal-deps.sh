#!/bin/sh
# Hello.
#
# React Native doesn't properly support symlinks (or perhaps it does now?), so this
# script will recompile and copy everything over.  It's pretty lame.  But hey, it
# does the job.
#
# Another Awesome Note:  The packager should be stopped before running this script.

# first, nuke the deps ... whether they be folders (from npm) or symlinks (from lerna)
rm -rf node_modules/reactotron-react-native
rm -rf node_modules/reactotron-redux-saga
rm -rf node_modules/reactotron-core-client
rm -rf node_modules/reactotron-redux
rm -rf node_modules/reactotron-apisauce
rm -f node_modules/reactotron-react-native
rm -f node_modules/reactotron-redux-saga
rm -f node_modules/reactotron-core-client
rm -f node_modules/reactotron-redux
rm -f node_modules/reactotron-apisauce

# reactotron-core-client
cd ../../../reactotron-core-client
yarn run build:dev
cd ../reactotron/examples/ReactotronTester
mkdir -p ./node_modules/reactotron-core-client
cp -r ../../../reactotron-core-client/dist ./node_modules/reactotron-core-client/dist
cp ../../../reactotron-core-client/package.json ./node_modules/reactotron-core-client/package.json

# reactotron-react-native
cd ../../../reactotron-react-native
yarn run build:dev
cd ../reactotron/examples/ReactotronTester
mkdir -p ./node_modules/reactotron-react-native
cp -r ../../../reactotron-react-native/dist ./node_modules/reactotron-react-native/dist
cp ../../../reactotron-react-native/package.json ./node_modules/reactotron-react-native/package.json

# reactotron-redux
cd ../../../reactotron-redux
yarn run build:dev
cd ../reactotron/examples/ReactotronTester
mkdir -p ./node_modules/reactotron-redux
cp ../../../reactotron-redux/dist/index.js ./node_modules/reactotron-redux/index.js

# reactotron-apisauce
cd ../../../reactotron-apisauce
yarn run build:dev
cd ../reactotron/examples/ReactotronTester
mkdir -p ./node_modules/reactotron-apisauce
cp ../../../reactotron-apisauce/dist/index.js ./node_modules/reactotron-apisauce/index.js

# reactotron-redux-saga
cd ../../../reactotron-redux-saga
yarn run build:dev
cd ../reactotron/examples/ReactotronTester
mkdir -p ./node_modules/reactotron-redux-saga
cp ../../../reactotron-redux-saga/dist/index.js ./node_modules/reactotron-redux-saga/index.js

# reactotron-mst
cd ../../../reactotron-mst
yarn run build:dev
cd ../reactotron/examples/ReactotronTester
mkdir -p ./node_modules/reactotron-mst
cp ../../../reactotron-mst/dist/reactotron-mst.umd.js ./node_modules/reactotron-mst/index.js

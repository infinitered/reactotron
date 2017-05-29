#!/bin/bash
echo "-=-=-=-=-=-=-=-=-=-=-=-=-=-"
echo "Pushing All Y'all Up To NPM"
echo "-=-=-=-=-=-=-=-=-=-=-=-=-=-"
cd packages/reactotron-core-client
npm run build
npm publish
cd ../reactotron-apisauce
npm run build
npm publish
cd ../reactotron-redux-saga
npm run build
npm publish
cd ../reactotron-redux
npm run build
npm publish
cd ../reactotron-react-js
npm run build
npm publish
cd ../reactotron-react-native
npm run build
npm publish
cd ../reactotron-core-server
npm run build
npm publish
cd ../..

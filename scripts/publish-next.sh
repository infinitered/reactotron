#!/bin/bash

echo "-=-=-=-=-=-=-=-=-=-=-=-=-=-"
echo "Publishing Next"
echo "-=-=-=-=-=-=-=-=-=-=-=-=-=-"
cd packages/reactotron-core-client
npm run build
npm publish --tag next
cd ../reactotron-apisauce
npm run build
npm publish --tag next
cd ../reactotron-redux-saga
npm run build
npm publish --tag next
cd ../reactotron-redux
npm run build
npm publish --tag next
cd ../reactotron-mst
npm run build
npm publish --tag next
cd ../reactotron-react-js
npm run build
npm publish --tag next
cd ../reactotron-react-native
npm run build
npm publish --tag next
cd ../reactotron-core-server
npm run build
npm publish --tag next
cd ../..

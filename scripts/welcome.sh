#!/bin/bash
echo "-=-=-=-=-=-=-=-=-="
echo "Welcome Developers"
echo "-=-=-=-=-=-=-=-=-="
echo ""
echo "Let's get your build environment ready."
echo ""
echo "Standby while we install dependencies."
echo ""
echo ""
cd packages/reactotron-core-client && yarn install && cd ../..
cd packages/reactotron-core-server && yarn install && cd ../..
cd packages/reactotron-apisauce && yarn install && cd ../..
cd packages/reactotron-redux && yarn install && cd ../..
cd packages/reactotron-redux-saga && yarn install && cd ../..
cd packages/reactotron-react-js && yarn install && cd ../..
cd packages/reactotron-react-native && yarn install && cd ../..
cd packages/demo-react-js && yarn install && cd ../..
cd packages/demo-react-native && yarn install && cd ../..
cd packages/reactotron-app && yarn install --ignore-engines && cd ../..

npm run e2e

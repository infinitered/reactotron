#!/bin/bash

npx pod-install
sh ./scripts/local-install.sh ../../lib/reactotron-redux reactotron-redux
sh ./scripts/local-install.sh ../../lib/reactotron-react-native reactotron-react-native
sh ./scripts/local-install.sh ../../lib/reactotron-apisauce reactotron-apisauce
# Hello.
#
# React Native doesn't properly support symlinks (or perhaps it does now?), so this
# script will recompile and copy everything over.  It's pretty lame.  But hey, it
# does the job.

# reactotron-core-server
cd ../reactotron-core-server
yarn run build
cd ../demo-react-native
mkdir -p ./node_modules/reactotron-core-server
cp ../reactotron-core-server/dist/index.js ./node_modules/reactotron-core-server/

# reactotron-core-client
cd ../reactotron-core-client
yarn run build
cd ../demo-react-native
mkdir -p ./node_modules/reactotron-core-client
cp ../reactotron-core-client/dist/index.js ./node_modules/reactotron-core-client/

# reactotron-redux
cd ../reactotron-redux
yarn run build
cd ../demo-react-native
mkdir -p ./node_modules/reactotron-redux
cp ../reactotron-redux/dist/index.js ./node_modules/reactotron-redux/

# reactotron-apisauce
cd ../reactotron-apisauce
yarn run build
cd ../demo-react-native
mkdir -p ./node_modules/reactotron-apisauce
cp ../reactotron-apisauce/dist/index.js ./node_modules/reactotron-apisauce/

# reactotron-redux-saga
cd ../reactotron-redux-saga
yarn run build
cd ../demo-react-native
mkdir -p ./node_modules/reactotron-redux-saga
cp ../reactotron-redux-saga/dist/index.js ./node_modules/reactotron-redux-saga/

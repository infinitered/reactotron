# Hello.
#
# React Native doesn't properly support symlinks (or perhaps it does now?), so this
# script will recompile and copy everything over.  It's pretty lame.  But hey, it
# does the job.

# reactotron-core-client
cd ../reactotron-core-client
yarn run build
cd ../demo-react-native
rm -f ./node_modules/reactotron-core-client
mkdir -p ./node_modules/reactotron-core-client
cp ../reactotron-core-client/dist/index.js ./node_modules/reactotron-core-client/

# reactotron-react-native
cd ../reactotron-react-native
yarn run build
cd ../demo-react-native
rm -f ./node_modules/reactotron-react-native
mkdir -p ./node_modules/reactotron-react-native
cp ../reactotron-react-native/dist/index.js ./node_modules/reactotron-react-native/

# reactotron-redux
cd ../reactotron-redux
yarn run build
cd ../demo-react-native
rm -f ./node_modules/reactotron-redux
mkdir -p ./node_modules/reactotron-redux
cp ../reactotron-redux/dist/index.js ./node_modules/reactotron-redux/

# reactotron-apisauce
cd ../reactotron-apisauce
yarn run build
cd ../demo-react-native
rm -f ./node_modules/reactotron-apisauce
mkdir -p ./node_modules/reactotron-apisauce
cp ../reactotron-apisauce/dist/index.js ./node_modules/reactotron-apisauce/

# reactotron-redux-saga
cd ../reactotron-redux-saga
yarn run build
cd ../demo-react-native
rm -f ./node_modules/reactotron-redux-saga
mkdir -p ./node_modules/reactotron-redux-saga
cp ../reactotron-redux-saga/dist/index.js ./node_modules/reactotron-redux-saga/

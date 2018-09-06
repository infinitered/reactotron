# This is a terrible idea but it works for now. One day hopefully we will have a better solution but this works for now
cd packages/reactotron-core-plugin
yarn build
sh ./run-links.sh

cd ../reactotron-plugin-legacy
yarn build
sh ./run-links.sh

cd ../reactotron-plugin-example
yarn build
sh ./run-links.sh

cd ../reactotron-server
sh ./run-links.sh

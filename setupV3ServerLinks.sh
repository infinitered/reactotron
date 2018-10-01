# This is a terrible idea but it works for now. One day hopefully we will have a better solution but this works for now
echo Setting Up Core Plugin
cd packages/reactotron-core-plugin
yarn build
sh ./run-links.sh

echo Setting Up Core UI
cd ../reactotron-core-ui
yarn build
sh ./run-links.sh

echo Setting Up Plugin Legacy
cd ../reactotron-plugin-legacy
yarn build
sh ./run-links.sh

echo Setting Up Plugin Example
cd ../reactotron-plugin-example
yarn build
sh ./run-links.sh

echo Setting Up Reactotron Server
cd ../reactotron-server
sh ./run-links.sh

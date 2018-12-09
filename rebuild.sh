#!/bin/bash

# remove everything
rm -rf node_modules
rm -rf dist
rm -rf release

# reinstall deps (still can't get yarn to reliably work)
yarn

# build production bundle
yarn build

# make apps for all platforms
yarn package

# sign the mac version
# requires my certificate on the active login keychain
codesign -s "$REACTOTRON_CODESIGN_IDENTITY" -vvv --deep --force release/darwin-x64/Reactotron-darwin-x64/Reactotron.app

# switch to the release temp dir
cd release

# 32 bit linux
cd linux-ia32
mv Reactotron-linux-ia32 Reactotron
zip -r Reactotron-linux-ia32.zip Reactotron
mv Reactotron-linux-ia32.zip ../
cd ..

# 64 bit linux
cd linux-x64
mv Reactotron-linux-x64 Reactotron
zip -r Reactotron-linux-x64.zip Reactotron
mv Reactotron-linux-x64.zip ../
cd ..

# 32 bit windows
cd win32-ia32
mv Reactotron-win32-ia32 Reactotron
zip -r Reactotron-win32-ia32.zip Reactotron
mv Reactotron-win32-ia32.zip ../
cd ..

# 64 bit windows
cd win32-x64
mv Reactotron-win32-x64 Reactotron
zip -r Reactotron-win32-x64.zip Reactotron
mv Reactotron-win32-x64.zip ../
cd ..

# macos

# -- still not working right.  doesn't seem to compress properly.
# cd darwin-x64/Reactotron-darwin-x64
# zip -r -X Reactotron.zip Reactotron.app
# mv Reactotron.zip ../../
# cd ../..

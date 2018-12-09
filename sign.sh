#!/usr/bin/env zsh

# clean up the release
rm -rf release

# build the app
npm run build
npm run package

# let's sign it up!
codesign -s $REACTOTRON_CODESIGN_IDENTITY -vvv --deep --force ./release/darwin-x64/Reactotron-darwin-x64/Reactotron.app

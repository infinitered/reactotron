#!/usr/bin/env bash

# replaces the version token and writes it back over itself
FILE=dist/client.js
sed -e 's/@@REACTOTRON_VERSION@@/'"$VERSION"'/g' $FILE > $FILE.tmp && mv $FILE.tmp $FILE
git add $FILE
git commit --message 'Inject version into client.'


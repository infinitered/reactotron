#!/usr/bin/env bash


# http://stackoverflow.com/a/246128/312785
path="${BASH_SOURCE[0]}"
while [ -h "$path" ] ; do
  dir="$(cd -P "$(dirname "$path")" && pwd)"
  path="$(readlink "$path")"
  [[ $path == /* ]] || path="$dir/$path"
done
dir="$(cd -P "$(dirname "$path")" && pwd)"


# replaces the version token and writes it back over itself
FILE=dist/client.js
sed -e 's/@@REACTOTRON_VERSION@@/'"$VERSION"'/g' $FILE > $FILE.tmp && mv $FILE.tmp $FILE
# git add $FILE
# git commit --message 'Inject version into client.'


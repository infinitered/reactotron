#!/bin/bash

# Make sure that our pod files are right
npx pod-install

# read from the ../package.json file
# and get the name of entries with the key "dependencies" or "devDependencies" that start with "reactotron-" and have a value of "file:../" path
# for each of those dependencies or devDependencies, run the local-install.sh script

jq -r '.dependencies | to_entries[] | select(.key | startswith("reactotron-")) | select(.value | startswith("file:../")) | .key' < "$PWD/package.json" | while read -r dep; do
  echo "Running ./scripts/local-install.sh for $dep in $PWD/package.json"
  sh ./scripts/local-install.sh "../../lib/$dep" "$dep"
done

jq -r '.devDependencies | to_entries[] | select(.key | startswith("reactotron-")) | select(.value | startswith("file:../")) | .key' < "$PWD/package.json" | while read -r dep; do
  echo "Running ./scripts/local-install.sh for $dep in $PWD/package.json"
  sh ./scripts/local-install.sh "../../lib/$dep" "$dep"
done

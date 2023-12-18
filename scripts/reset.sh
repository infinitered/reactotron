#!/bin/bash

sh scripts/clean.sh

echo "Removing all node_modules folders from the project"
find . -name "node_modules" -type d -prune -exec rm -rf {} \;

echo "Re-yarning"
yarn install

echo "Resetting nx"
npx nx reset

echo "You'll want to run \`yarn build\` next."

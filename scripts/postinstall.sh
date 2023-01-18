#!/bin/bash

echo "Run patch-package to apply patches to node_modules"
npx patch-package

echo "Build all workspace packages to ensure all internal dependencies are up to date"
yarn build
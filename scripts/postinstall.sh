#!/bin/bash

if [ "$SKIP_LIB_BUILD" = "1" ]; then
  echo "SKIP_LIB_BUILD=1, skipping workspace build"
  exit 0
fi

echo "Build all workspace packages to ensure all internal dependencies are up to date"
yarn build
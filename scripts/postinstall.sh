#!/bin/bash

NODE_VERSION=$(node -v | cut -d. -f1 | cut -dv -f2)
if [ "$NODE_VERSION" -lt "21" && "$CI" = "true" ]; then
  echo "Node $NODE_VERSION detected, skipping workspace build to avoid Bob/arktype ESM issues"
  exit 0
fi

echo "Build all workspace packages to ensure all internal dependencies are up to date"
yarn build
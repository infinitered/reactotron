#!/bin/bash

echo "Nx Reset - Clears all the cached Nx artifacts and metadata about the workspace and shuts down the Nx Daemon."
yarn nx reset

sh scripts/clean.sh

echo "Removing all node_modules folders from the project"
find . -name "node_modules" -type d -prune -exec rm -rf {} \;

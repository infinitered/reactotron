#!/bin/bash

sh scripts/clean.sh

echo "Removing all node_modules folders from the project"
find . -name "node_modules" -type d -prune -exec rm -rf {} \;

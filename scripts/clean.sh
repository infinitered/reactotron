#!/bin/bash

echo "Removing all node_modules folders from the project"
find . -name "node_modules" -type d -prune -exec rm -rf {} \;

echo "Removing all dist folders from the project"
find . -name "dist" -type d -prune -exec rm -rf {} \;

echo "Removing all release folders from the project"
find . -name "release" -type d -prune -exec rm -rf {} \;
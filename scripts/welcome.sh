#!/bin/bash
echo "-=-=-=-=-=-=-=-=-="
echo "Welcome Developers"
echo "-=-=-=-=-=-=-=-=-="
echo ""
echo "Let's get your build environment ready."
echo ""
echo "This will take about 5 minutes because.... well... npm.  amirite???"
echo ""
echo ""
npm run bootstrap
npm run build
npm run copy-internal-deps
npm test

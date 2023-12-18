#!/bin/bash

set -eo pipefail

: "${GPF_REACTOTRON_BRANCH:=build-trusted-commits}"

REACTOTRON_REPO="git@github.com:infinitered/reactotron.git"
BRANCH_SPEC=$1
NUM_COLONS=$(echo "$BRANCH_SPEC" | awk -F: '{print NF-1}')

if [ "$#" -ne 1 ] || [ "$NUM_COLONS" -ne 1 ] ; then
    echo "Usage: <fork_username>:<fork_branchname>"
    exit 1
fi

SOURCE_GH_USER=$(echo "$BRANCH_SPEC" | awk -F: '{print $1}')
SOURCE_BRANCH=$(echo "$BRANCH_SPEC" | awk -F: '{print $2}')
REPO_NAME=$(git remote get-url --push origin | awk -F/ '{print $NF}' | sed 's/\.git$//')

# Check if 'fork-to-test' remote exists and then remove it
if git config --get "remote.fork-to-test.url" > /dev/null; then
    git remote remove fork-to-test
    echo "Removed remote fork-to-test"
else
    echo "Remote fork-to-test does not exist, no need to remove it"
fi

git remote add fork-to-test "git@github.com:$SOURCE_GH_USER/$REPO_NAME.git"

git fetch --all
git push --force "$REACTOTRON_REPO" "refs/remotes/fork-to-test/$SOURCE_BRANCH:refs/heads/$GPF_REACTOTRON_BRANCH"
git remote remove fork-to-test || echo "Removed new remote fork-to-test"

cat <<EOF
Forked branch '$BRANCH_SPEC' has been pushed to branch '$GPF_REACTOTRON_BRANCH'
EOF

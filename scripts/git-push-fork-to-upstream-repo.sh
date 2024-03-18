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

# Check if 'temp-branch-to-test-fork' remote exists and then remove it
if git config --get "remote.temp-branch-to-test-fork.url" > /dev/null; then
    git remote remove temp-branch-to-test-fork
    echo "Removed remote temp-branch-to-test-fork"
else
    echo "Remote temp-branch-to-test-fork does not exist, no need to remove it"
fi

git remote add temp-branch-to-test-fork "git@github.com:$SOURCE_GH_USER/$REPO_NAME.git"

git fetch --all
git push --force "$REACTOTRON_REPO" "refs/remotes/temp-branch-to-test-fork/$SOURCE_BRANCH:refs/heads/$GPF_REACTOTRON_BRANCH"
git remote remove temp-branch-to-test-fork || echo "Removed new remote temp-branch-to-test-fork"

cat <<EOF
Forked branch '$BRANCH_SPEC' has been pushed to branch '$GPF_REACTOTRON_BRANCH'
EOF

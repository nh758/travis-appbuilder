#!/bin/bash


DEV_DIR=workdir/developer
cd $DEV_DIR

PROJECTS=$(ls -d */ | sed 's/\///')

echo ""
echo "==========================================="
echo "GitHub Commit Numbers:"

for PROJECT in $PROJECTS
do

    pushd $PROJECT > /dev/null

    GIT_REMOTE=$(git config --get remote.origin.url | sed 's/https:\/\/github.com\///' | sed 's/\.git//')
    GIT_BRANCH=$(git branch  --show-current)
    GIT_COMMIT_ID=$(git rev-parse HEAD)
    GIT_COMMIT_COUNT=$(git rev-list HEAD --count)

    printf '%-45s'           "$GIT_REMOTE"
    printf '%-10s'           "$GIT_BRANCH"
    printf '(Commit#: %-6s'  "$GIT_COMMIT_COUNT"
    printf 'ID: %-40s)'      "$GIT_COMMIT_ID"
    echo ""

    popd > /dev/null

done
echo "==========================================="
echo ""


#!/bin/bash

if [ $# -lt 2 ]; then
	echo "Usage: $? gitProjectName checkoutBranch"
	exit 1
fi

DEVELOPER_DIR=workdir/developer
PROJECT_DIR=workdir/developer/$1
BRANCH=$2

echo "Switching $PROJECT_DIR to $BRANCH branch..."

cd $PROJECT_DIR
git checkout --recurse-submodules $BRANCH
#npm install


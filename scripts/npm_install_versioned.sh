#!/bin/bash

if [ $# -lt 2 ]; then
	echo "Usage: $? projectName nodeVersion"
	exit 1
fi

DEVELOPER_DIR=workdir/developer
PROJECT_DIR=workdir/developer/$1
NODE_VERSION=$2
# 6.12.3
# 13.13.0 
ARGUMENTS="$3 $4 $5"

echo "Running 'npm install' on $PROJECT_DIR using node $NODE_VERSION"

cd $PROJECT_DIR

docker run -v $(pwd):/usr/src/app -w /usr/src/app node:$NODE_VERSION npm $ARGUMENTS
#docker run --mount type=bind,source="$(pwd)/developer/app_builder",target=/app -w /app node:6.12.3 npm run build


#!/bin/bash -v 

WORKING_DIR=workdir

#update installer
time \
npm install -g Hiro-Nakamura/ab-cli

#run installer
time \
appbuilder install $WORKING_DIR \
	--V1 \
	--develop \
	--travisCI \
	--port=1337 \
	--db.port=3306 \
	--db.password=r00t \
	--db.expose=true \
	--db.encryption=false \
	--arango.port=8529 \
	--arango.password=r00t \
	--arango.expose=false \
	--nginx.enable=false \
	--nginx.sslType=none \
	--smtp.enable=false \
	--smtp.auth=plain

#link in test configuration for docker swarm
ln -s ../docker-compose.test.yml workdir/docker-compose.test.yml

#show GitHub commit information
scripts/commit_info.sh

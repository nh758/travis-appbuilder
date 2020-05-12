#!/bin/sh

#install installer
#npm install -g Hiro-Nakamura/ab-cli

#run installer
WORKING_DIR=workdir

appbuilder install $WORKING_DIR \
	--V1 \
	--develop \
	--port=6500 \
	--db.port=6501 \
	--db.password=r00t \
	--db.expose=true \
	--db.encryption=false \
	--arango.port=6502 \
	--arango.password=r00t \
	--arango.expose=false \
	--nginxEnable=false \
	--nginx.sslType=none 


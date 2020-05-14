#!/bin/sh

#install installer
#npm install -g Hiro-Nakamura/ab-cli

#run installer
WORKING_DIR=workdir

appbuilder install $WORKING_DIR \
	--V1 \
	--port=1337 \
	--db.port=3306 \
	--db.password=r00t \
	--db.expose=true \
	--db.encryption=false \
	--arango.port=8529 \
	--arango.password=r00t \
	--arango.expose=false \
	--nginx.enable=false \
	--nginx.sslType=none 

	#--develop \
	#--nginx.enable=false \

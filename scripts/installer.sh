#!/bin/bash -v 

#run installer
WORKING_DIR=workdir

appbuilder install $WORKING_DIR \
	--V1 \
	--develop \
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

	#--nginx.enable=false \

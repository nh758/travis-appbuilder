#!/bin/bash -v 

#run installer
WORKING_DIR=workdir

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
	--smtp.auth=plain \ 
	| sed 's/ install (takes a while)/./g'

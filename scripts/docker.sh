#!/bin/bash

## ===================== SETUP =================================
MARIADB_IMAGE="db"
MARIADB_VOLUME="$MARIADB_IMAGE-data"
MARIADB_PORT=3306

ARANGODB_IMAGE="arangodb"
ARANGODB_VOLUME="$ARANGODB_IMAGE-data"
ARANGODB_APPS_VOLUME="$ARANGODB_IMAGE-apps-data"
ARANGODB_PORT=8529

SAILS_IMAGE="sails"
SAILS_PORT=1337

REDIS_IMAGE="redis"

EMAIL_IMAGE="email"

PM_IMAGE="pm"

NETWORK_NAME="babby"

# Docker requires absolute paths
BASE_DIR="$(pwd)/workdir"
## =============================================================



## ===================== FUNCTIONS =================================
create_network () {
  echo "Creating Docker network: $1"
  docker network create --driver bridge $1 
  echo ""
}

remove_network () {
  echo -n "Removing Docker network: " 
  docker network rm $1
}

create_volume () {
  echo -n "Creating Docker volume: "
  docker volume create $1
  echo ""
}

remove_volume () {
  echo -n "Removing Docker volume: "
  docker volume rm $1
}

stop_image () {
  echo -n "Stopping and removing Docker container: "

  # Using rm --force is much faster than issuing docker stop && docker rm
  docker rm --force $1
}

header () {
  echo ""
  echo "============="
  echo "$1 ..."
  echo "============="
}


up () {

  header "Starting"
 
  create_network $NETWORK_NAME

  echo "Creating Docker container: $MARIADB_IMAGE"
  docker run \
  	--rm \
  	--detach \
  	--name $MARIADB_IMAGE \
  	--network $NETWORK_NAME \
  	--publish $MARIADB_PORT:$MARIADB_PORT \
  	--env="MYSQL_ROOT_PASSWORD=r00t" \
  	--mount source=$MARIADB_VOLUME,target=/var/lib/mysql \
        --mount type=bind,source=$BASE_DIR/mysql/init,target=/docker-entrypoint-initdb.d,readonly \
  	mariadb
  #	#--publish 5001:3306 \
  echo ""
  
  
  echo "Creating Docker container: $ARANGODB_IMAGE"
  docker run \
  	--rm \
  	--detach \
  	--name $ARANGODB_IMAGE \
  	--network $NETWORK_NAME \
  	--publish $ARANGODB_PORT:$ARANGODB_PORT \
  	--env="ARANGO_ROOT_PASSWORD=r00t" \
  	--mount source=$ARANGODB_VOLUME,target=/var/lib/arangodb3 \
  	--mount source=$ARANGODB_APPS_VOLUME,target=/var/lib/arangodb3-apps \
  	arangodb
  	#--mount source=$ARANGODB_VOLUME,target=/var/lib/arangodb3 \
  	#--mount type=bind,source=$BASE_DIR/arango/data,target=/var/lib/arangodb3 \
  	#--mount type=bind,source=$BASE_DIR/arango/apps,target=/var/lib/arangodb3-apps \
  echo ""
 

  echo "Creating redis container: $REDIS_IMAGE"
  REDIS_COMMAND="redis-server --appendonly yes"
  docker run \
  	--detach \
  	--name $REDIS_IMAGE \
  	--network $NETWORK_NAME \
  	--mount type=bind,source=$BASE_DIR/redis/data/,target=/data \
  	redis  \
	$REDIS_COMMAND
  echo ""


  echo "Linking config file"
  ln -sf ../config $BASE_DIR

  echo "Creating Docker container: $EMAIL_IMAGE"
  EMAIL_COMMAND="node app.js"
  docker run \
  	--detach \
  	--name $EMAIL_IMAGE \
  	--network $NETWORK_NAME \
	--env COTE_DISCOVERY_REDIS_HOST=redis \
  	--mount type=bind,source=$BASE_DIR/developer/notification_email,target=/app \
  	--mount type=bind,source=$BASE_DIR/config/local.js,target=/app/config/local.js \
	-w /app \
  	node \
	$EMAIL_COMMAND

  	#--publish $EMAIL_PORT:$EMAIL_PORT \ #EMAIL_PORT=9229
	#-w /app
  echo ""

  echo "Creating Docker container: $PM_IMAGE"
  PM_COMMAND="node app.js"
  docker run \
  	--detach \
  	--name $PM_IMAGE \
  	--network $NETWORK_NAME \
	--env COTE_DISCOVERY_REDIS_HOST=redis \
  	--mount type=bind,source=$BASE_DIR/developer/process_manager,target=/app \
  	--mount type=bind,source=$BASE_DIR/config/local.js,target=/app/config/local.js \
	-w /app \
  	node \
	$PM_COMMAND

  	#--publish $EMAIL_PORT:$EMAIL_PORT \ #EMAIL_PORT=9229
	#-w /app
  echo ""

 
  
  echo "Creating Docker container: $SAILS_IMAGE"
  SAILS_COMMAND="node --inspect --max-old-space-size=2048 --stack-size=2048 app_waitForMySql.js"
  docker run \
  	--name $SAILS_IMAGE \
  	--network $NETWORK_NAME \
  	--publish $SAILS_PORT:$SAILS_PORT \
	--env COTE_DISCOVERY_REDIS_HOST=redis \
  	--mount type=bind,source=$BASE_DIR/app,target=/app \
  	--mount type=bind,source=$BASE_DIR/config/local.js,target=/app/config/local.js \
  	skipdaddy/install-ab:developer_v2 \
	$SAILS_COMMAND

	#-it \
  	#--detach \

  	#--mount type=bind,source=$BASE_DIR/data,target=/app/data \
  	#--mount type=bind,source=$BASE_DIR/app,target=/app \

  	#--mount type=bind,source=$BASE_DIR/developer/app_builder,target=/app/node_modules/app_builder \
  	#--mount type=bind,source=$BASE_DIR/developer/appdev-core,target=/app/node_modules/appdev-core \
  	#--mount type=bind,source=$BASE_DIR/developer/appdev-opsportal,target=/app/node_modules/appdev-opsportal \

	#node --inspect --max-old-space-size=2048 --stack-size=2048 app_waitForMySql.js

        #source: ./developer/app_builder      #target: /app/node_modules/app_builder
        #source: ./developer/appdev-core      #target: /app/node_modules/appdev-core
        #source: ./developer/appdev-opsportal #target: /app/node_modules/appdev-opsportal

  	#--restart=on-failure \
  echo ""

  	#--network $NETWORK_NAME \
  	#--publish $REDIS_PORT:$REDIS_PORT \ #REDIS_PORT=6379



}

down () {

  header "Stopping"
  stop_image $SAILS_IMAGE
  stop_image $PM_IMAGE
  stop_image $EMAIL_IMAGE
  stop_image $REDIS_IMAGE
  stop_image $MARIADB_IMAGE
  stop_image $ARANGODB_IMAGE
  
  header "Removing"
  remove_volume $ARANGODB_VOLUME
  remove_volume $ARANGODB_APPS_VOLUME
  remove_volume $MARIADB_VOLUME
  
  remove_network $NETWORK_NAME

}



## ===================== DEPLOY =================================

if [ "$1" == "up" ] 
then
  up


elif [ "$1" == "down" ]
then
  down

elif [ "$1" == "restart" ]
then
  $0 down && $0 up

else
  echo "Usage: $(basename $0) [up|down|restart]"

fi



#read -n1 -r -p "Press space to continue..." key

## ===================== CLEANUP =================================

#echo "Inside the Docker instance, type \"exit\" to clean-up"
#docker exec -it $MARIADB_IMAGE bash






#show_usage() {
#  echo "Usage: $(basename $0) [mariadb|arango|sails|all] [start|stop]"
#  exit 0
#}
#
#if [ "$*" == "mariadb start" ] ; then
#  echo "mariadb start"
#
#elif [ "$*" == "mariadb stop" ] ; then
#  echo "mariadb stop"
#
#elif [ "$*" == "arango start" ] ; then
#  echo "arango start"
#
#
#elif [ "$*" == "arango stop" ] ; then
#  echo "arango stop"
#
#elif [ "$*" == "sails start" ] ; then
#  echo "sails start"
#
#elif [ "$*" == "sails stop" ] ; then
#  echo "sails stop"
#
#elif [ "$*" == "all start" ] ; then
#  echo "all start"
#
#elif [ "$*" == "all stop" ] ; then
#  echo "all stop"
#
#else
#  show_usage
#fi
#
#
#
#if [ "$2" == "start" ] 
#  then 
#  echo "start requested"
#
#elif [ "$2" == "stop" ] 
#  then 
#  echo "stop requested"
#else
#  show_usage
#fi
#
#
#
#exit 0








# database related files:
#   dbinit-compose.yml
#   mysql/init/01-CreateDBs.sql
#   mysql/init/02-InitData.sql.gz*
# creates databases : appbuilder, site (CHARACTER SET utf8mb4)
# creates user      : root (GRANT ALL ON *.* TO root)

#  CREATE DATABASE IF NOT EXISTS `appbuilder` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
#  CREATE DATABASE IF NOT EXISTS `site` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
#  
#  # create root user and grant rights
#  # CREATE USER 'root'@'localhost' IDENTIFIED BY 'local';
#  GRANT ALL ON *.* TO 'root'@'%';



# MariaDB commands
# 
# fails:  docker run --name=mariadb_test mariadb  
# 
# set PW
# passes: docker run --name=mariadb_test --env="MYSQL_ROOT_PASSWORD=r00t" mariadb
#
# detach
# passes: docker run --detach --name=mariadb_test --env="MYSQL_ROOT_PASSWORD=r00t" mariadb
#
# publish port to the host as port 5001
# passes: docker run --detach --name=mariadb_test --env="MYSQL_ROOT_PASSWORD=r00t" --publish 5001:3306 mariadb
#
# additional settings can be appended: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
#
# setting the database data directory: --volume=./testing-mysql-datadir:/var/lib/mysql 
#
# database initialization: --volume=./mysql/init:docker-entrypoint-initdb.d
#
# using Docker's "mount tmpfs" would be ideal, but works only under Linux: https://docs.docker.com/storage/tmpfs/
#  --mount type=tmpfs,destination=/var/lib/mysql \
#
# source: ./mysql/init  target: /docker-entrypoint-initdb.d
#
# --mount type=bind,source="$(pwd)"/mysql/init,target=/docker-entrypoint-initdb.d \






#   docker run --name some-mariadb -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mariadb:tag
#
#   docker run -it --network some-network --rm mariadb mysql -hsome-mariadb -uexample-user -p
#
#   docker run -it --rm mariadb mysql -hsome.mysql.host -usome-mysql-user -p
#
# docker run --name some-mariadb -e MYSQL_ROOT_PASSWORD=my-secret-pw -d mariadb:tag --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci


# MariaDB yml
# Use root/example as user/password credentials
# version: '3.1'
# 
# services:
#   db:
#     image: mariadb
#     restart: always
#     environment:
#       MYSQL_ROOT_PASSWORD: example
# 
#   adminer:
#     image: adminer
#     restart: always
#     ports:
#       - 8080:8080





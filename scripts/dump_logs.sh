#!/bin/bash

#docker ps --filter name=ab_ --format "table {{.ID}}: {{.Names}}"
CONTAINERS=$(docker ps --quiet --filter name=ab_)

for CONTAINER in $CONTAINERS 
do
    echo "========================================="
    docker ps --filter id=$CONTAINER 
    echo "========================================="
    docker logs $CONTAINER
done


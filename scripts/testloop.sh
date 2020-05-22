#!/bin/bash 

COUNTER=0

if [ "$#" -ne 1 ] ; then 
  echo "Usage: $0 number_of_loops"
  exit 1
fi

while [  $COUNTER -lt $1 ]; do
    echo "Loop number: $COUNTER"
    npm run headless
    EXITCODE=$?
    if [ $EXITCODE -ne 0 ]; then 
      echo "Failed on loop number: $COUNTER"
      exit $EXITCODE
    fi
    let COUNTER=COUNTER+1 
done


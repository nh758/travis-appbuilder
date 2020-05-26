#/bin/bash

NETWORK_STACK=ab_default

echo ""
echo "This will restart the AppBuilder test environment, and reset the test database to a starting state."
echo ""

cd workdir
echo "Bringing down ab stack..."
./Down.sh
while [ true ] ; 
do
  echo -n ".."
  if [ -z "$(docker network ls | grep $NETWORK_STACK)" ] ; then  
    echo ""
    echo "Bringing up ab stack..."
    docker stack deploy -c docker-compose.test.yml ab
    exit 0
  fi
done

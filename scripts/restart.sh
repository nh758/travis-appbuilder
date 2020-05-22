#/bin/bash

cd workdir
echo "Bringing down ab stack..."
./Down.sh
while [ true ] ; 
do
  echo -n ".."
  if [ -z "$(docker network ls | grep ab)" ] ; then  
    echo ""
    echo "Bringing up ab stack..."
    ./UP.sh
    exit 0
  fi
done

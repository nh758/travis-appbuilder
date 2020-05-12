#!/bin/bash

# launching from travis-appbuilder/

# triggered from travis-appbuilder push
#    /home/travis/build/user/travis-appbulder
#    pull all 3 

# triggered from app_builder push
#    /home/travis/build/user/app_builder
#    git clone https://github.com/echu888/travis-appbuilder
#    svn export https://github.com/username/repo-name/trunk/
#    wget https://raw.githubusercontent.com/echu888/travis-appbuilder/master/travis-appbuilder-setup.sh
     

# triggered from appdev-core push
#    /home/travis/build/user/appdev-core

# triggered from appdev-opsportal
#    /home/travis/build/user/appdev-opsportal



#if project not [ app_builder ]       git clone [ app_builder ]
#if project not [ appdev-core ]       git clone [ appdev-core ]
#if project not [ appdev-opsportal ]  git clone [ appdev-opsportal ]

#https://github.com/appdevdesigns/app_builder.git
#https://github.com/appdevdesigns/appdev-core.git
#https://github.com/appdevdesigns/appdev-opsportal.git

# specify the branch!!!!

CURRENT_DIR=$(pwd)
CURRENT_PROJECT=$(basename $CURRENT_DIR)


place_files () {
  local TARGET_DIR="developer"
  local PROJECT=$1
  local BRANCH=$2
  echo "=================================================================="
  echo "Placing files for [$1] into directory: [$TARGET_DIR]"
  echo "=================================================================="
  
  pushd $TARGET_DIR

    if [ "$CURRENT_PROJECT" == "$PROJECT" ]
    then
          echo "Using current directory"
          echo "Linking files from $CURRENT_DIR into $TARGET_DIR"
          ln -s $(pwd) $TARGET_DIR

    else
          echo "Using GIT"
          local GITHUB_PATH="https://github.com/appdevdesigns/$PROJECT.git"
          time git clone --recurse-submodules $GITHUB_PATH
          if [ $? != 0 ] ; then
            echo "place_files() could not git clone $GITHUB_PATH"
            exit 1;
          fi
    fi

    pushd $PROJECT
      npm install
    popd

  popd
  echo ""
}




print_header() {
  echo "=================================================================="
  echo "Travis CI Continuous Integration Script for AppBuilder"
  echo "=================================================================="
  echo "Current Directory: $CURRENT_DIR"
  echo "Current Project:   $CURRENT_PROJECT"
  echo "=================================================================="
  echo ""
}

main () {
  print_header

  place_files app_builder
  place_files appdev-core
  place_files appdev-opsportal



  
}


main




#docker run mariadb
#docker run arangodb

#set up correct links

#docker run sails  --> with 3 mounts listed above

#npm run test:ci
# -> cypress run




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




CURRENT_DIR=$(pwd)
CURRENT_PROJECT=$(basename $CURRENT_DIR)


git_clone() {
  local BRANCH=$1
  local REMOTE=$2
  local GIT_OPTIONS="--recurse-submodules"
  git clone $GIT_OPTIONS --single-branch --branch $BRANCH $REMOTE
  if [ $? != 0 ] ; then
    echo "Failed to clone git project: $GITHUB_PATH"
    exit 1;
  fi
}

npm_install() {
  local PROJECT_DIR=$1
  pushd $PROJECT_DIR
    npm install
    if [ $? != 0 ] ; then
      echo "Failed to run 'npm install' on $PROJECT_DIR"
      exit 1;
    fi
  popd

}


place_files () {
  local TARGET_DIR="developer"
  local BRANCH=$1
  local PROJECT=$2
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
          time git_clone $BRANCH $GITHUB_PATH
    fi

    npm_install $PROJECT

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

do_main () {
  print_header

  place_files develop app_builder
  place_files develop appdev-core
  place_files develop appdev-opsportal
}


do_main





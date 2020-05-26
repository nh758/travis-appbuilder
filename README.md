# travis-appbuilder

## Install steps
- git clone https://github.com/echu888/travis-appbuilder.git
- cd travis-appbuilder
- npm install
- scripts/installer.sh
- npm run test

## Imported directories that will be used by docker images:
- arango
- config
- data
- mysql

## Docker images that will be used:
- mariadb
- arangodb
- ab_sails:1.0 (based on skipdaddy/install-ab:developer_v2)

## strategy #1: Use simple scripts
- pull various git repositories into developer/
- start MariaDB Docker image
- start ArangoDB Docker image
- start Sails Docker image
- npm run test
- blocking: cannot properly "install" app_builder and populate the /app directory 

## strategy #2: Use ab-cli
- use ab-cli to install
- start appbuilder
- npm run test
- weakness: ab-cli cannot currently specify branches

## Progress:

### strategy #1: Using docker.sh (production):
- successful: https://travis-ci.org/github/echu888/travis-appbuilder/builds/686864741

### strategy #1: Using docker.sh (developer):
- blocking: currently unable to generate proper files for /app directory

### strategy #2: Using ab-cli (production):
- successful: https://travis-ci.org/github/echu888/travis-appbuilder/builds/686878938

### strategy #2: Using ab-cli (developer):
- failure: appbuilder --develop is too verbose: https://travis-ci.org/github/echu888/travis-appbuilder/builds/686884389
- blocking: new changes in develop branch may not be working: https://travis-ci.org/github/echu888/travis-appbuilder/builds/686891264

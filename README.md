# travis-appbuilder

## Dependencies
- node.js, npm
- Docker

## Installation steps
- git clone https://github.com/echu888/travis-appbuilder.git
- cd travis-appbuilder
- npm install
- npm install -g Hiro-Nakamura/ab-cli
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
- skipdaddy/install-ab:developer_v2 (based on ab_sails:1.0)
- node:latest
- node:6

## Primary strategy: Use ab-cli
- use ab-cli to install
- start appbuilder
- npm run test
- weakness: ab-cli cannot currently specify branches

## Alternate strategy: Use simple scripts
- pull various git repositories into developer/
- start MariaDB Docker image
- start ArangoDB Docker image
- start Sails Docker image
- npm run test
- blocking: cannot properly "install" app_builder and populate the /app directory 

## Progress:

### Primary strategy: Using ab-cli
- production level is successful: https://travis-ci.org/github/echu888/travis-appbuilder/builds/686878938
- developer level is successful: https://travis-ci.org/github/echu888/travis-appbuilder/builds/691221045

### Alternate strategy: Using docker.sh
- production level is successful: https://travis-ci.org/github/echu888/travis-appbuilder/builds/686864741
- developer level is blocking: currently unable to generate proper files for /app directory

# travis-appbuilder

## Imported directories that will be used by docker images:
- arango
- config
- data
- mysql

## Docker images that will be used:
- mariadb
- arangodb
- ab_sails:1.0 (based on skipdaddy/install-ab:developer_v2)

## strategy #1:
- pull various git repositories into developer/
- start MariaDB Docker image
- start ArangoDB Docker image
- start Sails Docker image
- run npm test

## strategy #2:
- use ab-cli to install
- start appbuilder
- run npm test

## Progress:

### strategy #1: Using docker.sh (production):
- successful: https://travis-ci.org/github/echu888/travis-appbuilder/builds/686864741

### strategy #1: Using docker.sh (developer):
- blocking: currently unable to generate proper files for /app directory

### strategy #2: Using ab-cli (production):
- successful: https://travis-ci.org/github/echu888/travis-appbuilder/builds/686878938

### strategy #2: Using ab-cli (developer):
- appbuilder --develop is too verbose: https://travis-ci.org/github/echu888/travis-appbuilder/builds/686884389
- awaiting testing
- weakness of ab-cli: cannot specify branches
- blocking: new changes in develop branch may not be working




# travis-appbuilder

Execute:
test.sh

Imported directories that will be used by docker images:
- arango
- config
- data
- mysql

Docker images that will be used:
- mariadb
- arangodb
- ab_sails:1.0 (based on skipdaddy/install-ab:developer_v2)

General strategy:
- Pull various git repositories into developer/
- start MariaDB Docker image
- start ArangoDB Docker image
- start Sails Docker image
- run npm test

Using docker.sh (production):
https://travis-ci.org/github/echu888/travis-appbuilder/builds/686864741

Using docker.sh (developer):
currently unable to generate proper files for /app directory

Using ab-cli (production):
https://travis-ci.org/github/echu888/travis-appbuilder/builds/686878938

Using ab-cli (developer):
waiting testing





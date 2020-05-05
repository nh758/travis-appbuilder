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



#!/bin/bash

echo "Setting up DB"
mongo test/setup/setupdb.js


if [ ! -z "$TRAVIS" ]; then
    echo "Starting test server"
    node app.js --server:port 3102 --database:name postest &
    TESTPID=$(echo $!)
    echo "Test server started with pid $TESTPID"
fi

echo "Running mocha tests"
./node_modules/.bin/mocha test/model/*.js

echo "Running protractor tests"
./node_modules/.bin/protractor test/conf/protractor.js

if [ ! -z "$TRAVIS" ]; then
    echo "Killing testserver"
    kill $TESTPID
fi

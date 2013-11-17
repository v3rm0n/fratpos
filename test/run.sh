#!/bin/bash

#Exit when any of the commands fails
set -e

echo "Setting up DB"
mongo test/setup/setupdb.js


if [ "$TRAVIS" = "" ]; then
    echo "Starting test server"
    node app.js --server:port 3102 --database:name postest --admin:authenticate false &
    TESTPID=$(echo $!)
    echo "Test server started with pid $TESTPID"
    #Alway stop the server when the script exits
    trap "kill $TESTPID" EXIT
fi

echo "Running mocha tests"
./node_modules/.bin/mocha test/model/*.js

echo "Running protractor tests"
./node_modules/.bin/protractor test/conf/protractor.js
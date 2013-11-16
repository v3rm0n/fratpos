/*jslint node: true */
"use strict";
var sys = require('sys');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout); }

//Setup DB
var setup = spawn("mongo", ["test/setup/setupdb.js"], {stdio: "inherit"});

var runProtractorTests = function () {
    if (process.env.TRAVIS !== "true") {
        exec("node app.js --server:port 3102 --database:name postest", puts);
    }
    spawn("./node_modules/.bin/protractor", ["test/conf/protractor.js"], {stdio: "inherit"});
};

setup.on('close', function (code) {
    if (code === 0) {
        //Run Mocha tests
        var mocha = spawn("./node_modules/.bin/mocha", ["test/model/*.js"], {stdio: "inherit"});
        mocha.on('close', function (code) {
            if (code === 0) {
                runProtractorTests();
            } else {
                console.log("Mocha tests failed, not running Protractor tests");
            }
        });
    }
});

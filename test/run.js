/*jslint node: true */
"use strict";
var sys = require('sys');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
function puts(error, stdout, stderr) { sys.puts(stdout); }

//Setup DB
var setup = spawn("mongo", ["test/setup/setupdb.js"], {stdio: "inherit"});

var runProtractorTests = function (cb) {
    if (process.env.TRAVIS !== "true") {
        exec("node app.js --server:port 3102 --database:name postest", puts);
    }
    var protactor = spawn("./node_modules/.bin/protractor", ["test/conf/protractor.js"], {stdio: "inherit"});
    protactor.on('close', cb);
};

setup.on('close', function (code) {
    if (code === 0) {
        //Run Mocha tests
        var mocha = spawn("./node_modules/.bin/mocha", ["test/model/*.js"], {stdio: "inherit"});
        mocha.on('close', function (code) {
            if (code === 0) {
                runProtractorTests(function (code) {
                    process.exit(code);
                });
            } else {
                console.log("Mocha tests failed, not running Protractor tests");
            }
            process.exit(code);
        });
    }
});

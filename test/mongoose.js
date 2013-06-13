/*jslint node: true*/
"use strict";

//Init test DB for mongoose
var nconf = require('nconf');
nconf.overrides({
    "database": {
        "name": "postest"
    }
});

var db = require('../lib/db');

db.init();

var mongoose = require('mongoose');

module.exports = mongoose;
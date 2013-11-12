/*jslint node: true*/
"use strict";

//Configuration parameters from argument line, environment and file
var nconf = require('nconf');
//Usual pipeline
nconf.argv().env().file({ file: './config.json' });
module.exports = nconf;
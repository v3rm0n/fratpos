/*jslint node: true nomen: true*/
"use strict";

var nconf = require('./nconf'),
    mongoose = require('mongoose'),
    dbConnection = '',
    user = nconf.get('database:username'),
    password = nconf.get('database:password');

if (user.length !== 0) {
    dbConnection += user + ':' + password + '@';
}

dbConnection += nconf.get('database:host') + ':' + nconf.get('database:port') + '/' + nconf.get('database:name');

module.exports.init = function () {
    mongoose.connect(dbConnection);
    // Bootstrap models
    var fs = require('fs'),
        modelsPath = __dirname + '/../models';
    fs.readdirSync(modelsPath).forEach(function (file) {
        require(modelsPath + '/' + file);
    });
};
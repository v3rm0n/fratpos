/*jslint node: true*/
"use strict";

var nconf = require('./nconf');
var passport = require('passport'),
    DigestStrategy = require('passport-http').DigestStrategy;

exports.init = function () {
    passport.use('admin', new DigestStrategy({ qop: 'auth', realm: nconf.get('admin:realm') },
        function (username, done) {
            if (username !== nconf.get('admin:username')) { return done(null, false); }
            return done(null, username, nconf.get('admin:password'));
        }
        ));

    passport.use('pos', new DigestStrategy({ qop: 'auth', realm: nconf.get('posuser:realm') },
        function (username, done) {
            if (username !== nconf.get('posuser:username')) { return done(null, false); }
            return done(null, username, nconf.get('posuser:password'));
        }
        ));

    return passport.initialize();
};

exports.authAdmin = function (req, res, next) {
    if (nconf.get('admin:authenticate') === 'true') {
        passport.authenticate('admin', {session: false})(req, res, next);
    } else {
        next();
    }
};

exports.authPos = function (req, res, next) {
    if (nconf.get('posuser:authenticate') === 'true') {
        passport.authenticate('pos', {session: false})(req, res, next);
    } else {
        next();
    }
};
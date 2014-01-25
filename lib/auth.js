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

    passport.use('pos', new DigestStrategy({ qop: 'auth', realm: nconf.get('pos:realm') },
        function (username, done) {
            if (username !== nconf.get('pos:username')) { return done(null, false); }
            return done(null, username, nconf.get('pos:password'));
        }
        ));

    return passport.initialize();
};

var authenticationFilter = function (prefix) {
    return function (req, res, next) {
        if (nconf.get(prefix + ':authenticate') === 'true') {
            passport.authenticate(prefix, {session: false})(req, res, next);
        } else {
            next();
        }
    };
};

exports.admin = function (req, res, next) {
    authenticationFilter('admin')(req, res, next);
};

exports.pos = function (req, res, next) {
    authenticationFilter('pos')(req, res, next);
};
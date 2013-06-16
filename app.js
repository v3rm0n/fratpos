/*jslint node: true nomen: true*/
"use strict";

var nconf = require('./lib/nconf'),
    passport = require('./lib/passport'),
    db = require('./lib/db'),
    fs = require('fs'),
    modelsPath = __dirname + '/models',
    express = require('express'),
    http = require('http'),
    path = require('path'),
    app = express(),
    i18n = require('i18next');

db.init();
i18n.init();

app.configure(function () {
    app.set('port', nconf.get('server:port') || 3000);
    app.use(i18n.handle);
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.compress());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(passport.init());
    app.use(app.router);
    app.use(express['static'](path.join(__dirname, 'public')));
});

i18n.registerAppHelper(app);

app.configure('development', function () {
    app.use(express.errorHandler());
});

require('./lib/routes')(app);

require('./lib/appcache')(app);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

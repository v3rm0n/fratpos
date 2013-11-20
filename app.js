/*jslint node: true nomen: true*/
"use strict";

var nconf = require('./lib/nconf'),
    auth = require('./lib/auth'),
    db = require('./lib/db'),
    fs = require('fs'),
    modelsPath = __dirname + '/models',
    express = require('express'),
    http = require('http'),
    https = require('https'),
    path = require('path'),
    app = express(),
    i18n = require('i18next'),
    useSsl = nconf.get('server:ssl:use');

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
    app.use(auth.init());
    app.use(app.router);
    app.use(express['static'](path.join(__dirname, 'public')));
});

i18n.registerAppHelper(app);

app.configure('development', function () {
    app.use(express.errorHandler());
});

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});

require('./lib/routes')(app);

if (useSsl === 'true') {
    var options = {
        // The Server's SSL Key
        key: fs.readFileSync(nconf.get('server:ssl:key')),
        // The Server's Cert
        cert: fs.readFileSync(nconf.get('server:ssl:cert')),
        // The CA (us in this case)
        ca: fs.readFileSync(nconf.get('server:ssl:ca')),
        // Ask for the client's cert
        requestCert: true,
        // Don't automatically reject
        rejectUnauthorized: false
    };
    https.createServer(options, app).listen(app.get('port'), function () {
        console.log('Express ssl server listening on port ' + app.get('port'));
    });
} else {
    http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });
}

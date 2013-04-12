//For config files
var nconf = require('./nconf');

//For authentication
var passport = require('passport'),
    DigestStrategy = require('passport-http').DigestStrategy;

passport.use(new DigestStrategy({ qop: 'auth' },
  function(username, done) {
      if (username != nconf.get("admin:username")) { return done(null, false); }
      return done(null, username, nconf.get("admin:password"));
  }
));

//Web framework
var express = require('express'),
   http = require('http'),
   path = require('path');

var app = express();

app.configure(function(){
  app.set('port', nconf.get('server:port') || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(passport.initialize());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./routes')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

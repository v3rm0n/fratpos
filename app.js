//For config files
var nconf = require('./lib/nconf');

//For authentication
var passport = require('./lib/passport');

//Database
var db = require('./lib/db');
db.connect();

// Bootstrap models
var fs = require('fs');
var modelsPath = __dirname + '/models';
fs.readdirSync(modelsPath).forEach(function(file){
  require(modelsPath+'/'+file);
});

//Web framework
var express = require('express'),
   http = require('http'),
   path = require('path');

var app = express();

app.configure(function(){
  app.set('port', nconf.get('server:port'));
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(passport.init());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

require('./lib/routes')(app);

require('./lib/appcache')(app);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

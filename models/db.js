var nconf = require('../lib/nconf');
var mongojs = require('mongojs');

var dbConnection = '';

var user = nconf.get('database:username');
var password = nconf.get('database:password');

if(user.length != 0){
  dbConnection += user + ':' + password + '@';
}

dbConnection += nconf.get('database:host')+ ':' + nconf.get('database:port') + '/' + nconf.get('database:name');

var db = mongojs.connect(dbConnection);
module.exports = db;
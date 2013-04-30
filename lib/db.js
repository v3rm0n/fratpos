var nconf = require('./nconf');
var mongoose = require('mongoose');

var dbConnection = '';

var user = nconf.get('database:username');
var password = nconf.get('database:password');

if(user.length != 0){
  dbConnection += user + ':' + password + '@';
}

dbConnection += nconf.get('database:host')+ ':' + nconf.get('database:port') + '/' + nconf.get('database:name');

module.exports.connect = function(){
  mongoose.connect(dbConnection);
}
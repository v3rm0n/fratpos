var nconf = require('../nconf');

var db = require('mongojs').connect(nconf.get('database:connection'));
module.exports = db;
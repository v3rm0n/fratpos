var db = require('./db');
var paytypes = db.collection('paytypes');

exports.getAll = function(callback){
    paytypes.find(callback);
}
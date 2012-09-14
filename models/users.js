var db = require('./db');
var users = db.collection("users");

exports.getAll = function(callback){
	users.find(callback);
}

exports.save = function(user){
    users.save(user);
}
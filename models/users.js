var db = require('./db');
var users = db.collection('users');

exports.getAll = function(callback){
	users.find(callback);
}

exports.save = function(user,callback){
    users.save(user, callback);
}

exports.remove = function(id,callback){
    users.remove({_id: db.ObjectId(id)}, callback);
}

exports.changeBalance = function(id, balance, callback){
    users.update({_id: db.ObjectId(id)}, {$set: {balance: balance}},callback);
}
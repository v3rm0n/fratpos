var db = require('./db');
var users = db.collection('users');

exports.getAll = function(callback){
	users.find(callback);
}

exports.save = function(user,callback){
    console.log(user);
    users.save(user, callback);
}

exports.remove = function(id,callback){
    console.log('Removing user: '+id);
    users.remove({_id: db.ObjectId(id)}, callback);
}

exports.changeBalance = function(id, balance, callback){
    console.log('Changing user '+id+'balance to '+balance);
    users.update({_id: db.ObjectId(id)}, {$set: {balance: balance}},callback);
}
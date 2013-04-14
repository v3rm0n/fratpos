var db = require('./db');
var users = db.collection('users');
var async = require('async');

exports.getAll = function(callback){
    exports.getWithFilter({}, callback);
}

exports.getWithFilter = function(filter, callback){
    users.find(filter, function(err,users){
        if(err != null){callback(err);return;}
        var addName = function(user, callback){
            user.label = exports.getUserFullName(user);
            callback(null, user);
        }
        async.map(users, addName, function(err, users){
            callback(err,users);
        });
    });
}

exports.get = function(id,callback){
    users.findOne({_id: db.ObjectId(id)}, callback);
}

exports.save = function(user,callback){
    console.log(user);
    if(user._id != null)
        user._id = db.ObjectId(user._id)
    users.save(user, callback);
}

exports.remove = function(id,callback){
    console.log('Removing user: '+id);
    users.remove({_id: db.ObjectId(id)}, callback);
}

exports.incrementBalance = function(id, increment, callback){
    console.log('Incrementing user '+id+'balance by '+increment);
    users.update({_id: db.ObjectId(id)}, {$inc: {balance: increment}},callback);
}

exports.getUserFullName = function(user){
    var fullName = user.status + ' ' + user.firstname + ' ' + user.lastname +
    (user.beername != null && user.beername.length > 0 ? ' ('+user.beername+')' : '');
    return fullName;
}

exports.resetBalances = function(callback){
    users.update({},{$set: {balance: 0}}, {multi: true}, callback);
}
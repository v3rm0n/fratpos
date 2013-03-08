var db = require('./db');
var users = db.collection('users');

exports.getAll = function(callback){
	users.find(callback);
}

exports.get = function(id,callback){
    users.findOne({_id: db.ObjectId(id)}, callback);
}

exports.getUser = function(fullName,callback){
    var user = userFromFullName(fullName);
    users.findOne({firstname: user.firstname, lastname: user.lastname}, callback);
}

exports.save = function(user,callback){
    console.log(user);
    users.save(user, callback);
}

exports.update = function(id,user,callback){
    console.log("Updating user: "+id);
    users.update({_id: db.ObjectId(id)},
        {$set: {firstname: user.firstname, lastname: user.lastname, beername: user.beername, status: user.status}},
        callback);
}

exports.remove = function(id,callback){
    console.log('Removing user: '+id);
    users.remove({_id: db.ObjectId(id)}, callback);
}

exports.changeBalance = function(id, balance, callback){
    console.log('Changing user '+id+'balance to '+balance);
    users.update({_id: db.ObjectId(id)}, {$set: {balance: balance}},callback);
}

exports.incrementBalance = function(id, increment, callback){
    console.log('Incrementing user '+id+'balance by '+increment);
    users.update({_id: db.ObjectId(id)}, {$inc: {balance: increment}},callback);
}

exports.resetBalances = function(callback){
    users.update({},{$set: {balance: 0}}, {multi: true}, callback);
}

exports.getUserFullName = function(user){
    var fullName = user.status+' '+user.firstname+' '+user.lastname+' ('+user.beername+')';
    return fullName;
}

var userFromFullName = function(fullName){
    //status! Firstname Lastname (Beername)
    console.log(fullName);
    var params = /([\wäöõü]*!?) ([\wöäüõ]*) ([\wöäüõ]*)/i.exec(fullName);
    return {
        status: params[1],
        firstname: params[2],
        lastname: params[3]
    }
}
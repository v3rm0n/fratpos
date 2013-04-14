var users = require('../models/users');
var statuses = require('../models/statuses');

exports.all = function(req,res){
    users.getAll(function(err, users){
        res.send(users);
    });
}

exports.save = function(req,res){
    var user = req.body.user;
    if(!user.balance)
        user.balance = 0;
    users.save(user, function(err){
        res.send(user);
    }); 
}

exports.remove = function(req,res){
    users.remove(req.body.id, function(err){
        res.send({status: err == null ? 'success' : err});
    });
}

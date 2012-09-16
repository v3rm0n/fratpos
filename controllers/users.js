var users = require('../models/users');

exports.index = function(req,res){
	users.getAll(function(err, docs) {
        var names = docs.map(function(item){ return item.status+' '+item.firstname+' '+item.lastname+' ('+item.beername+')';});
        res.send(names);
    });
}

exports.add = function(req,res){
    var user = {
        status: req.body.status,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        beername: req.body.beername,
        balance: 0
    }
    users.save(user,function(err){
        res.redirect('/admin#users');
    });
}

exports.remove = function(req,res){
    users.remove(req.body.id, function(err){
        res.send({status: err == null ? 'success' : err});
    });
}

exports.changeBalance = function(req,res){
    users.changeBalance(req.body.id, Number(req.body.balance), function(err){
        res.redirect('/admin#users');
    });
}

exports.balance = function(req,res){
    users.getUser(req.query.fullName,function(err,user){
        res.send({status: err == null ? 'success' : err, balance: user.balance});
    })
}
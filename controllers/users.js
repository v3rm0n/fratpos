var users = require('../models/users');
var statuses = require('../models/statuses');

exports.all = function(req,res){
    users.getAll(function(err, users){
        res.send(users);
    });
}

exports.add = function(req,res){
    var user = {
        status: req.body.status,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        beername: req.body.beername
    }
    var id = req.body.id;
    if(id != ''){
        users.update(id,user,function(err){
            res.redirect('/admin#users');
        });
    }
    else {
        user.balance = 0;
        users.save(user,function(err){
            res.redirect('/admin#users');
        }); 
    }
}

exports.remove = function(req,res){
    users.remove(req.body.id, function(err){
        res.send({status: err == null ? 'success' : err});
    });
}

exports.change = function(req,res){
    if(req.query.id == null){
        renderUser(null, res);
    }
    else {
        users.get(req.query.id, function(err,user){
            renderUser(user, res);
        });
    }
}

var renderUser = function(user, res){
    if(user == null){
        user = {
            _id: '',
            firstname: '',
            lastname: '',
            beername: '',
            status: ''
        };
    }
    statuses.getAll(function(err, statuses){
        res.render('user', {user: user, statuses: statuses});
    });
}

exports.changeBalance = function(req,res){
    users.changeBalance(req.body.id, Number(req.body.balance), function(err){
        res.redirect('/admin#users');
    });
}

exports.reset = function(req,res){
    users.resetBalances(function(err){
        users.getAll(function(err, users){
            res.send(users);
        });
    });
}

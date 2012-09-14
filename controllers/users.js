var users = require('../models/users');

exports.index = function(req,res){
	users.getAll(function(err, docs) {
        var names = docs.map(function(item){ return item.status+' '+item.firstname+' '+item.lastname;});
        console.log(names);
        res.send(names);
    });
}

exports.add = function(req,res){
    console.log('Creating user: '+req.query.firstname);
    var user = {
        status: req.body.status,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        beername: req.body.beername,
        balance: 0
    }
    users.save(user);
    res.redirect('/admin#users');
}
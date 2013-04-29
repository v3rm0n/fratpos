var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.all = function(req,res){
    User.find({},function(err, users){
        res.send(users);
    });
}

exports.save = function(req,res){
    var user = new User(req.body.user);
    user.save(function(err,user){
        res.send(user);
    });
}

exports.remove = function(req,res){
    User.remove({_id: req.body.id}, function(err){
        res.send({status: err == null ? 'success' : err});
    });
}

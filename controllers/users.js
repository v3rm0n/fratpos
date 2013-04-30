var mongoose = require('mongoose');
var User = mongoose.model('User');

exports.all = function(req,res){
    User.find({},function(err, users){
        res.send(users);
    });
}

exports.save = function(req,res){
    var reqUser = req.body.user;
    var user = {
        firstname: reqUser.firstname,
        lastname: reqUser.lastname,
        beername: reqUser.beername,
        status: reqUser.status,
        balance: reqUser.balance || 0
    };
    var id = reqUser._id || new mongoose.Types.ObjectId;
    User.findByIdAndUpdate(id, user, {upsert: true}, function(err, user){
        if(err){res.send({status: err});return;}
        res.send(user);
    });
}

exports.remove = function(req,res){
    User.remove({_id: req.body.id}, function(err){
        res.send({status: err == null ? 'success' : err});
    });
}

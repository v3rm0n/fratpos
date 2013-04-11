var statuses = require('../models/statuses');

exports.all = function(req, res){
  statuses.getAll(function(err, statuses) {
      res.send(statuses);
  });
}

exports.addStatus = function(req, res) {
    statuses.save({name: req.body.status}, function(err){
        res.redirect('/admin#statuses');
    });
}

exports.removeStatus = function(req, res) {
    statuses.remove(req.body.id, function(err){
        res.send({status: err == null ? 'success' : err});
    });
}
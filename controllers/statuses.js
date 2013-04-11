var statuses = require('../models/statuses');

exports.all = function(req, res){
  statuses.getAll(function(err, statuses) {
      res.send(statuses);
  });
}

exports.save = function(req, res) {
    var status = req.body.status;
    statuses.save(status, function(err){
        res.send(status);
    });
}

exports.remove = function(req, res) {
    statuses.remove(req.body.id, function(err){
        res.send({status: err == null ? 'success' : err});
    });
}
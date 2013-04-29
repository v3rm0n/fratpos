var mongoose = require('mongoose');
var Status = mongoose.model('Status');

exports.all = function(req, res){
  Status.find({},function(err, statuses) {
      res.send(statuses);
  });
}

exports.save = function(req, res) {
    var status = new Status(req.body.status);
    status.save(function(err,status){
        res.send(status);
    });
}

exports.remove = function(req, res) {
    Status.remove({_id: req.body.id}, function(err){
        res.send({status: err == null ? 'success' : err});
    });
}
var mongoose = require('mongoose');
var Paytype = mongoose.model('Paytype');

exports.all = function(req, res){
  Paytype.find({},function(err, paytypes) {
      res.send(paytypes);
  });
}

exports.save = function(req, res){
    var paytype = new Paytype(req.body.paytype);
    paytype.save(function(err, paytype){
        res.send(paytype);
    });
}

exports.remove = function(req, res) {
    Paytype.remove({_id: req.body.id}, function(err){
        res.send({status: err == null ? 'success' : err});
    });
}
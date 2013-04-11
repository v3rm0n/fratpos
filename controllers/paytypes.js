var paytypes = require('../models/paytypes');

exports.all = function(req, res){
  paytypes.getAll(function(err, paytypes) {
      res.send(paytypes);
  });
}

exports.save = function(req, res){
    var paytype = req.body.paytype;
    paytypes.save(paytype, function(err){
        res.send(paytype);
    });
}

exports.remove = function(req, res) {
    paytypes.remove(req.body.id, function(err){
        res.send({status: err == null ? 'success' : err});
    });
}
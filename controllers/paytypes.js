var paytypes = require('../models/paytypes');

exports.all = function(req, res){
  paytypes.getAll(function(err, paytypes) {
      res.send(paytypes);
  });
}

exports.addPaytype = function(req, res){
    var paytype = {
        name: req.body.name,
        affectsBalance: req.body.affectsBalance == 'on',
        allowedForStatus: req.body.allowedForStatus
    }
    paytypes.save(paytype, function(err){
        res.redirect('/admin#paytypes');
    });
}

exports.removePaytype = function(req, res) {
    paytypes.remove(req.body.id, function(err){
        res.send({status: err == null ? 'success' : err});
    });
}
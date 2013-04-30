var mongoose = require('mongoose');
var Transaction = mongoose.model('Transaction');

exports.all = function(req, res){
  Transaction.findAll(function(err, transactions) {
      res.send(transactions);
  });
}
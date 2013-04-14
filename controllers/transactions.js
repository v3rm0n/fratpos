var transactions = require('../models/transactions');

exports.all = function(req, res){
  transactions.getAll(function(err, transactions) {
      res.send(transactions);
  });
}
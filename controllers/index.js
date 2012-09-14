//Kassa
exports.index = function(req, res){
    var transactions = require('../models/transactions');
    transactions.getAll(function(err,trans){
        res.render('index', { title: 'Kassa', transactions: trans});
    });
};

exports.transaction = function(req,res){
    res.json({status: "success"});
}
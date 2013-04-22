var stocktakings = require('../models/stocktakings');
var users = require('../models/users');
var transactions = require('../models/transactions');
var products = require('../models/products');
var async = require('async');
var fs = require('fs');
var csv = require('csv');
var handlebars = require('handlebars');

exports.all = function(req, res){
  stocktakings.getAll(function(err, stocktakings) {
      res.send(stocktakings);
  });
}

exports.generate = function(req, res) {
    async.parallel({
      users: async.apply(users.getWithFilter, {balance: { $ne: 0}}),
      transactions: async.apply(transactions.getAll),
      products: async.apply(products.getAll)
    },
    function(err, result){
      if(err){res.send({status: err});return;}
      var stocktaking = {
        time: new Date(),
        users: result.users,
        transactions: result.transactions,
        products: result.products
      }
      stocktakings.save(stocktaking, function(err){
        if(err){res.send({status: err});return;}
        async.parallel([
          async.apply(users.resetBalances),
          async.apply(transactions.remove)
          ],
          function(err){
            if(err){res.send({status: err});return;}
            res.send(stocktaking);
          });
      });
    });
}

exports.html = function(req, res) {
  stocktakings.get(req.params.id, function(err, stocktaking){
    res.render('stocktaking', { title: 'Inventuur', manifest: null, stocktaking: stocktaking});
  });
}

exports.csv = function(req, res) {
  res.type("text/csv");
  transformStocktakingToCSV(req.params.id, function(err, content){
    csv().from(content).to.stream(res);
  });
}

var transformStocktakingToCSV = function(id, callback){
  if(id == null){callback("Stocktaking cannot be null!", null);return;}
  async.parallel({
    template: function(callback){
      fs.readFile("./template/stocktaking.js", "utf8", function(err, data){
        if(err != null){callback(err); return;}
        var template = handlebars.compile(data);
        callback(null, template);
      });
    },
    stocktaking: async.apply(stocktakings.get, id)
  },
  function(err, result){
    if(err != null){callback(err); return;}
    var content = result.template(result.stocktaking);
    callback(null, content);
  });
}
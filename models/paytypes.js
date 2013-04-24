var db = require('./db');
var paytypes = db.collection('paytypes');

exports.getAll = function(callback){
    paytypes.find(callback);
}

exports.get = function(name, callback){
  console.log('Get paytype by name: '+name);
  paytypes.findOne({name: name}, callback);
}

exports.save = function(paytype, callback){
    paytypes.save(paytype, callback);
}

exports.remove = function(id, callback){
    paytypes.remove({_id: db.ObjectId(id)}, callback);
}
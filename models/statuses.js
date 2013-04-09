var db = require('./db');
var statuses = db.collection('statuses');

exports.getAll = function(callback){
    statuses.find(callback);
}

exports.save = function(status, callback){
    statuses.save(status, callback);
}

exports.remove = function(id, callback){
  statuses.remove({_id: db.ObjectId(id)}, callback);
}
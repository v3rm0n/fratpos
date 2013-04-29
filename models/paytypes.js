var mongoose = require('mongoose');
Schema = mongoose.Schema;
var StatusSchema = require('./statuses');

var PaytypeSchema = new Schema({
  name: String,
  affectsBalance: Boolean,
  affectsQuantity: Boolean,
  credit: Boolean,
  allowedForStatus: [{type: String}]
});

PaytypeSchema.methods = {
  isAllowedForStatus: function(status){
    return this.allowedForStatus.indexOf(status) != -1;
  }
}

PaytypeSchema.statics = {
  findByName: function(name,cb){
    this.find({name: name}, cb);
  }
}

mongoose.model('Paytype', PaytypeSchema);
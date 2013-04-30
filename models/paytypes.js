var mongoose = require('mongoose');
Schema = mongoose.Schema;

var PaytypeSchema = new Schema({
  name: String,
  affectsBalance: Boolean,
  affectsQuantity: Boolean,
  credit: Boolean,
  allowedForStatus: [{type: String}]
});

PaytypeSchema.method('isAllowedForStatus', function(status){
  return this.allowedForStatus.indexOf(status) != -1;
});

PaytypeSchema.static('findByName', function(name, cb){
  this.model('Paytype').findOne({name: name}, cb);
});

mongoose.model('Paytype', PaytypeSchema);
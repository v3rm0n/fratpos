var mongoose = require('mongoose');
Schema = mongoose.Schema;

var ProductSchema = new Schema({
  name: String,
  price: Number,
  quantity: Number
});

module.exports = ProductSchema;

mongoose.model('Product', ProductSchema);
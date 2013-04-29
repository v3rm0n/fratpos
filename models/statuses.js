var mongoose = require('mongoose');
Schema = mongoose.Schema;

var StatusSchema = new Schema({
  name: String
});

module.exports = StatusSchema;

mongoose.model('Status', StatusSchema);
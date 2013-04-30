var mongoose = require('mongoose');
Schema = mongoose.Schema;

var StatusSchema = new Schema({
  name: String
});

mongoose.model('Status', StatusSchema);
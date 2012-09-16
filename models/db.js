var mongojs = require('mongojs');
var db = mongojs.connect('posdb');
db.ObjectId = mongojs.ObjectId;
module.exports = db;
var db = require('./db');
var users = db.collection("users");

exports.getAll = function(res){
	users.find(function(err, docs) {
		var names = docs.map(function(item){ return item.name;});
		console.log(names);
		res.send(names);
	});
}
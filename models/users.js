var mongoose = require('mongoose');
Schema = mongoose.Schema;

var UserSchema = new Schema({
    firstname: String,
    lastname: String,
    beername: String,
    status: String,
    balance: Number
},
{
    toJSON: {virtuals: true}
});

UserSchema.virtual('label').get(function(){
    var fullName = this.status + ' ' + this.firstname + ' ' + this.lastname +
        (this.beername != null && this.beername.length > 0 ? ' ('+this.beername+')' : '');
    return fullName;
});

UserSchema.statics = {
    resetBalances: function(cb){
        this.update({},{$set: {balance: 0}}, {multi: true}).exec(cb);
    },
    incrementBalance: function(id, amount, cb){
        console.log('Incrementing user '+this._id+' balance by '+amount);
        this.update({_id: id}, {$inc: {balance: amount}}, cb);
    }
};

module.exports = UserSchema;

mongoose.model('User', UserSchema);
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

UserSchema.methods = {
    incrementBalance: function(amount, cb){
        console.log('Incrementing user '+this._id+' balance by '+amount);
        this.balance += amount;
        this.save();
    }
};

UserSchema.statics = {
    resetBalances: function(cb){
        this.update({},{$set: {balance: 0}}, {multi: true}).exec(cb);
    }
};

module.exports = UserSchema;

mongoose.model('User', UserSchema);
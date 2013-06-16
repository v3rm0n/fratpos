/*jslint node: true nomen: true*/
"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema(
    {
        firstname: {type: String, required: true},
        lastname: {type: String, required: true},
        beername: {type: String, "default": ''},
        status: {type: String, required: true},
        balance: {type: Number, "default": 0}
    },
    {
        toJSON: {virtuals: true}
    }
);

UserSchema.virtual('label').get(function () {
    var fullName = this.status + ' ' + this.firstname + ' ' + this.lastname +
        (this.beername !== undefined && this.beername.length > 0 ? ' (' + this.beername + ')' : '');
    return fullName;
});

UserSchema.statics = {
    resetBalances: function (cb) {
        this.model('User').update({}, {$set: {balance: 0}}, {multi: true}, cb);
    },
    incrementBalance: function (id, amount, cb) {
        console.log('Incrementing user ' + id + ' balance by ' + amount);
        this.model('User').update({_id: id}, {$inc: {balance: amount}}, cb);
    }
};

module.exports = UserSchema;

mongoose.model('User', UserSchema);
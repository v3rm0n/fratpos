/*jslint node: true*/
"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PaytypeSchema = new Schema({
    name: {type: String, required: true},
    affectsBalance: {type: Boolean, required: true},
    affectsQuantity: {type: Boolean, required: true},
    credit: {type: Boolean, required: true},
    allowedForStatus: {type: [String], required: true}
});

PaytypeSchema.method('isAllowedForStatus', function (status) {
    return this.allowedForStatus.indexOf(status) !== -1;
});

PaytypeSchema['static']('findByName', function (name, cb) {
    this.model('Paytype').findOne({name: name}, cb);
});

mongoose.model('Paytype', PaytypeSchema);
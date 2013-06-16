/*jslint node: true*/
"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StatusSchema = new Schema({
    name: {type: String, required: true}
});

mongoose.model('Status', StatusSchema);
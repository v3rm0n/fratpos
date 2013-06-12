/*jslint node: true*/
"use strict";

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var StatusSchema = new Schema({
    name: String
});

mongoose.model('Status', StatusSchema);
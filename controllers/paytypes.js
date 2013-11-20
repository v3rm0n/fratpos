/*jslint node: true nomen: true*/
"use strict";

var mongoose = require('mongoose');
var Paytype = mongoose.model('Paytype');

exports.all = function (req, res) {
    Paytype.find(function (err, paytypes) {
        if (err) {res.send({status: err}); return; }
        res.send(paytypes);
    });
};

exports.save = function (req, res) {
    console.log('Saving paytype named ' + req.body.paytype);
    var paytype = new Paytype(req.body.paytype);
    paytype.save(function (err, paytype) {
        if (err) {res.send({status: err}); return; }
        res.send(paytype);
    });
};

exports.remove = function (req, res) {
    Paytype.remove({_id: req.body.id}, function (err) {
        res.send({status: err === null ? 'success' : err});
    });
};
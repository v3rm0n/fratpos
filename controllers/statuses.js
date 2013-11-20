/*jslint node: true nomen: true*/
"use strict";

var mongoose = require('mongoose');
var Status = mongoose.model('Status');

exports.all = function (req, res) {
    Status.find(function (err, statuses) {
        if (err) {res.send({status: err}); return; }
        res.send(statuses);
    });
};

exports.save = function (req, res) {
    var status = new Status(req.body.status);
    status.save(function (err, status) {
        if (err) {res.send({status: err}); return; }
        res.send(status);
    });
};

exports.remove = function (req, res) {
    Status.remove({_id: req.body.id}, function (err) {
        res.send({status: err === null ? 'success' : err});
    });
};
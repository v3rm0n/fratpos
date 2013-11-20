/*jslint node: true nomen: true*/
"use strict";

var mongoose = require('mongoose');
var Feedback = mongoose.model('Feedback');

exports.all = function (req, res) {
    Feedback.find(function (err, feedbacks) {
        if (err) {res.send({status: err}); return; }
        res.send(feedbacks);
    });
};

exports.remove = function (req, res) {
    Feedback.remove({_id: req.body.id}, function (err) {
        res.send({status: err === null ? 'success' : err});
    });
};
/*jslint node: true nomen: true*/
/*global describe, beforeEach, afterEach, it*/
"use strict";

var mongoose = require('../mongoose');
var should = require('should');
var Feedback = mongoose.model('Feedback');

describe('Feedback', function () {

    it('should find feedbacks', function (done) {
        Feedback.find(function (err, feedbacks) {
            feedbacks.length.should.equal(2);
            done();
        });
    });

    it('should fail when content is missing', function (done) {
        var feedback = new Feedback({
            time: new Date(),
            content: null
        });
        feedback.save(function (err, feedback) {
            should.exist(err);
            err.message.should.equal('Validation failed');
            done();
        });
    });

    it('should succeed with content', function (done) {
        var feedback = new Feedback({
            time: new Date(),
            content: "random"
        });
        feedback.save(function (err, feedback) {
            should.not.exist(err);
            feedback.content.should.equal('random');
            done();
        });
    });

});
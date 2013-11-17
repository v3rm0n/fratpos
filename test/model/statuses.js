/*jslint node: true nomen: true*/
/*global describe, beforeEach, afterEach, it*/
"use strict";

var mongoose = require('../mongoose');
var should = require('should');
var Status = mongoose.model('Status');

describe('Statuses', function () {
    var teststatus = null;

    beforeEach(function (done) {
        var status = new Status({
            name: "!reb"
        });
        status.save(function (err, status) {
            should.not.exist(err);
            teststatus = status;
            done();
        });
    });

    afterEach(function (done) {
        Status.remove({name: "!reb"}, done);
    });

    it('should find statuses', function (done) {
        Status.findOne({name: "!reb"}, function (err, status) {
            status.name.should.equal("!reb");
            done();
        });
    });

    it('should fail when name is missing', function (done) {
        var status = new Status({
            name: null
        });
        status.save(function (err, status) {
            should.exist(err);
            err.message.should.equal('Validation failed');
            done();
        });
    });

});
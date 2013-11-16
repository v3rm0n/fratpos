/*jslint node: true nomen: true*/
/*global describe, beforeEach, afterEach, it*/
"use strict";

var mongoose = require('../mongoose');
var Status = mongoose.model('Status');

describe('Statuses', function () {
    var teststatus = null;

    beforeEach(function (done) {
        var status = new Status({
            name: "!reb"
        });
        status.save(function (err, status) {
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

});
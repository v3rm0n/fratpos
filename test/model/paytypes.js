/*jslint node: true nomen: true*/
/*global describe, beforeEach, afterEach, it*/
"use strict";

var mongoose = require('../mongoose');
var Paytype = mongoose.model('Paytype');

describe('Paytypes', function () {
    var testpaytype = null;

    beforeEach(function (done) {
        var paytype = new Paytype({
            name: "Paytype balance",
            affectsBalance: true,
            affectsQuantity: false,
            credit: false,
            allowedForStatus: ['!reb']
        });
        paytype.save(function (err, paytype) {
            testpaytype = paytype;
            done();
        });
    });
    
    afterEach(function (done) {
        Paytype.remove({}, done);
    });
    
    it('should find paytypes', function (done) {
        Paytype.find({}, function (err, paytypes) {
            paytypes.length.should.equal(1);
            paytypes[0].isAllowedForStatus('!reb').should.equal(true);
            paytypes[0].isAllowedForStatus('!vil').should.equal(false);
            done();
        });
    });
    
    it('should find paytype by name', function (done) {
        Paytype.findByName(testpaytype.name, function (err, paytype) {
            paytype.name.should.equal(testpaytype.name);
            done();
        });
    });
});
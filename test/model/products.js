/*jslint node: true nomen: true*/
/*global describe, beforeEach, afterEach, it*/
"use strict";

var mongoose = require('../mongoose');
var should = require('should');
var Product = mongoose.model('Product');

describe('Products', function () {
    var testproduct = null;

    beforeEach(function (done) {
        var product = new Product({
            name: "Testproduct",
            price: 2.56,
            quantity: 10
        });
        product.save(function (err, product) {
            testproduct = product;
            done();
        });
    });

    afterEach(function (done) {
        Product.remove({name: testproduct.name}, done);
    });

    it('should find products', function (done) {
        Product.find({name: testproduct.name}, function (err, products) {
            products.length.should.equal(1);
            products[0].name.should.equal(testproduct.name);
            done();
        });
    });

    it('should increment product quantity', function (done) {
        Product.incrementQuantity(testproduct, 5, function (err) {
            Product.findOne({name: testproduct.name}, function (err, product) {
                product.quantity.should.equal(15);
                done();
            });
        });
    });

    it('should fail when name is missing', function (done) {
        var product = new Product({
            price: 2.56,
            quantity: 10
        });
        product.save(function (err, product) {
            should.exist(err);
            done();
        });
    });

    it('should fail when price is missing', function (done) {
        var product = new Product({
            name: "Testproduct",
            quantity: 10
        });
        product.save(function (err, product) {
            should.exist(err);
            done();
        });
    });

    it('should default to 0 when quantity is missing', function (done) {
        var product = new Product({
            name: "Testproduct",
            price: 2.56
        });
        product.save(function (err, product) {
            should.not.exist(err);
            product.quantity.should.equal(0);
            done();
        });
    });

});
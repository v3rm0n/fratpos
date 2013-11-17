/*jslint node: true */
"use strict";

var createTransaction = function () {
    //Search for user
    element(by.model('user')).sendKeys('reb!');

    //Choose user
    element(by.css('#userinput li a')).click();

    //Add one product to the transaction
    element(by.repeater('product in filteredProducts()').row(1)).findElement(by.css('.gi-circle_plus')).click();

    //Finish transaction and pay
    element(by.repeater('paytype in paytypes').row(0)).click();

    expect(element(by.repeater('transaction in filteredTransactions()').row(0).column('user.label')).getText()).toEqual('reb! Rebane Rebane (Test)');
};

var invalidateTransaction = function () {
    element(by.repeater('transaction in filteredTransactions()').row(0)).click();

    browser.switchTo().alert().accept();

    var all = browser.findElements(by.repeater('transaction in filteredTransactions()'));
    all.then(function (arr) {
        expect(arr.length).toEqual(0);
    });
};

describe('Point of sale interface', function () {
    browser.get('/');
    browser. waitForAngular();
    it('should greate a transaction', createTransaction);
    it('should invalidate a transaction', invalidateTransaction);
});
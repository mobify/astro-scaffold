/*
 Put actions in this page object.
 
 Do not perform verifications here. Verifications and assertions should go
 either in the test script or, for commonly used assertions, placed in an 
 assertions object in tests/system/assertions. 
*/

var selectors = {
    // Define selectors here
    header: 'header',
    body: 'body',
    footer: 'footer'
};

var Home = function(browser) {
    this.browser = browser;
    this.selectors = selectors;
};

Home.prototype.doSomething = function() {
    this.browser
        .log('Home - doSomething')
        .waitForElementVisible(selectors.body)
        .click(selectors.body);
    return this;
};

module.exports = Home;
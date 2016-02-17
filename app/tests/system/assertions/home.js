/*
 Place commonly used assertions here.

 Use selectors from the equivalent page object. 
*/

var Home = require('../pageObjects/home');

var home;
var selectors;

function HomeAssertions(browser) {
    this.browser = browser;
    home = new Home(browser);
    selectors = home.selectors;
}

HomeAssertions.prototype.assertElements = function() {
    this.browser
        .waitForElementVisible(selectors.header)
        .assert.elementsVisible(
            selectors.header,
            selectors.body,
            selectors.footer
        );
    return this;
};

module.exports = HomeAssertions;
var GlobalAssertions = require('../assertions/global');

var globalAssertions;

module.exports = {
    before: function(browser) {
        browser.pause(1000);
        globalAssertions = new GlobalAssertions(browser);
    },

    'Landscape should be disabled': function(browser) {
        globalAssertions.assertPortrait();
        browser.end();
    }
};

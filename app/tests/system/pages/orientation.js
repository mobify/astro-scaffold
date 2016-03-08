var GlobalAssertions = require('../assertions/global');

var globalAssertions;

module.exports = {
    before: function(browser) {
        globalAssertions = new GlobalAssertions(browser);
    },

    'Landscape should be enabled': function(browser) {
        globalAssertions.assertLandscape();
        browser.end();
    }
};

/*
 Global assertions for any webview context.
*/

var GlobalAssertions = function(browser) {
    this.browser = browser;
};

/*
 Assert that landscape mode is disabled.
*/
GlobalAssertions.prototype.assertPortrait = function() {
    var self = this;
    this.browser
        .contexts(function(result) {
            self.browser
                .setContext(result.value[result.value.length - 1])
                .setOrientation('LANDSCAPE')
                .execute(function() {
                    return window.orientation;
                }, function(result) {
                        var rotation = result.value;
                        self.browser.log('Window rotation should be 0.');
                        this.assert.equal(rotation, 0);
                    }
                );
        });
    return this;
};

/*
 Assert that landscape mode is enabled.
*/
GlobalAssertions.prototype.assertLandscape = function() {
    var self = this;
    this.browser
        .contexts(function(result) {
            self.browser
                .setContext(result.value[result.value.length - 1])
                .setOrientation('LANDSCAPE')
                .execute(function() {
                    return window.orientation;
                }, function(result) {
                        var rotation = result.value;
                        self.browser.log('Window rotation should not be 0.');
                        this.assert.notEqual(rotation, 0);
                    }
                );
        });
    return this;
};

module.exports = GlobalAssertions;

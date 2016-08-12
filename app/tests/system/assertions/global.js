/*
 Global assertions for any context.
*/

var orientations = {
    portrait: 0,
    clockwise: -90,
    counterClockwise: 90,
    upsideDown: 180
};

var GlobalAssertions = function(browser) {
    this.browser = browser;
};

/*
 Assert that landscape mode is disabled.

 Set browser orientation to landscape, then verify the value of
 window.orientation:
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
                    self.browser.log('Window orientation should be portrait.');
                    this.assert.equal(rotation, orientations.portrait);
                }
            );
        });
    return this;
};

/*
 Assert that landscape mode is enabled.

 Set browser orientation to landscape, then verify the value of
 window.orientation:
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
                    self.browser.log('Window orientation should be (counter)clockwise.');
                    this.assert.notEqual(rotation, orientations.portrait);
                    this.assert.notEqual(rotation, orientations.upsideDown);
                }
            );
        });
    return this;
};

module.exports = GlobalAssertions;

/*
 Put iOS-specific actions in this page object.

 Do not perform verifications here. Verifications and assertions should go
 either in the test script or, for commonly used assertions, placed in an
 assertions object in tests/system/assertions.
*/

var selectors = {
    // Define selectors here

    // This xpath is the example, please update the xpath.
    BACK_BUTTON_XPATH: '//UIAApplication[1]/UIAWindow[1]/UIANavigationBar[1]/UIAButton[2]',
    PROFILE_XPATH: '//UIATabBar[1]/UIAButton[4]'
};

var iOSAction = function(browser) {
    this.browser = browser;
    this.selectors = selectors;
};

iOSAction.prototype.clickBackButton = function() {

    var self = this;

    this.browser
        .contexts(function(result) {
            self.browser
                .useXpath()
                //set context to NATIVE_APP
                .setContext(result.value[0])
                .log('These are the contexts: ' + result.value)
                .waitForElementVisible(selectors.BACK_BUTTON_XPATH)
                .log('Clicking System Back button')
                .click(selectors.BACK_BUTTON_XPATH);
        });

    this.browser
        //Wait for the page loaded completely
        .pause(7000)
        .contexts(function(ctx) {
            self.browser
                //set context to WEBVIEW
                .setContext(ctx.value[ctx.value.length - 1])
                .log('These are the contexts: ' + ctx.value)
                .useCss();
        });
    return this;
};

iOSAction.prototype.clickProfileTab = function() {

    var self = this;

    this.browser
        .contexts(function(result) {
            self.browser
                .log('Going to Profile tab')
                //set context to NATIVE_APP
                .setContext(result.value[0])
                .waitForElementVisible(selectors.PROFILE_XPATH)
                .click(selectors.PROFILE_XPATH);
        });
    return this;
};

iOSAction.prototype.setContext = function(contextName) {

    var self = this;

    this.browser
        .log('Starting Set Context')
        .setContext(contextName)
        .currentContext(function(ctx) {
            self.browser.log('The current context is ' + ctx.value);
        })
        .url(function(url) {
            self.browser.log('Print the URL ' + url.value);
        })
        .useCss();
    return this;
};

module.exports = iOSAction;
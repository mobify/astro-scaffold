/*
 Put Android-specific actions in this page object.

 Do not perform verifications here. Verifications and assertions should go
 either in the test script or, for commonly used assertions, placed in an
 assertions object in tests/system/assertions.
*/

var selectors = {
    // Define selectors here

    // This xpath is the example, please update the xpath.
    HAMBURGER_MENU_BUTTON_XPATH: '//android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.support.v4.widget.DrawerLayout[1]/android.widget.LinearLayout[1]/android.widget.LinearLayout[1]/android.widget.RelativeLayout[1]/android.widget.FrameLayout[1]/android.widget.ImageView[1]'
};

var AndroidAction = function(browser) {
    this.browser = browser;
    this.selectors = selectors;
};

AndroidAction.prototype.clickHamburgerMenuButton = function() {

    var self = this;

    this.browser
        .contexts(function(result) {
            self.browser
                .useXpath()
                // set context to NATIVE_APP
                .setContext(result.value[0])
                .currentContext(function(ctx) {
                    self.browser.log('The context after switching ' + ctx.value);
                })
                .waitForElementVisible(selectors.HAMBURGER_MENU_BUTTON_XPATH)
                .log('Clicking Hamburger Menu button')
                .click(selectors.HAMBURGER_MENU_BUTTON_XPATH)
                //Waiting for the page load completely
                .pause(5000)
                .log('Starting Set Context')
                .useCss()
                //set context to WEBVIEW
                .setContext(result.value[result.value.length - 1])
                .currentContext(function(ctx) {
                    self.browser.log('The current context is ' + ctx.value);
                });
        });
    return this;
};

AndroidAction.prototype.clickBackButton = function() {
    this.browser
        .pause(3000)
        .log('Clicking System Back Button')
        .back()
        .waitUntilMobified();
    return this;
};

AndroidAction.prototype.setWindowHandle = function(winNum) {

    var self = this;

    this.browser
        //Check the currect context is Native or webview
        .currentContext(function(ctx) {
            self.browser.log('This is the current context on AndroidAction: ' + ctx.value);
        })
        .windowHandles(function(result) {
            self.browser
                //switch window
                .switchWindow(result.value[winNum])
                .windowHandle(function(result) {
                    self.browser.log('The current handle is ' + result.value);
                })
                .url(function(url) {
                    self.browser.log('Print the URL ' + url.value);
                });
        });
    return this;
};

module.exports = AndroidAction;

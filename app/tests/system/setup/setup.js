/*
 * Loop through the custom contexts that exist when the app starts
 * and grab their names.
 *
 * To change the environment we're testing against, specify it in site.json.
 * This should align with what the app is built against, which is declared in
 * app/environment.js hostUrl
 */

var Site = require('../site.json');

var Setup = {};

var selectors = {
    previewButton: '#authorize',
    registeredAuctionList: '.js-auction-lists'
};

var expected = {
    //EXAMPLE Webviews constructed for project. 
    //These expressions are match the part of the URL 
    'noInternet': /no-internet\.html/i,
    'couldNotLoad': /could-not-load\.html/i
};

Setup.isAndroid = function(platform) {
    platform = platform || 'platformName';
    return platform.toLowerCase() === 'android';
};

Setup.appPreview = function(browser) {
    browser.contexts(function(result) {
        browser.session(function(type) {
            browser.log('Running on platform - ' + type.value.platformName);
            if (isAndroid(type.value.platform)) {
                var contextsAndroid = result.value;
                browser
                    .log('Starting Preview Process')
                    .currentContext(function(ctx) {
                        browser.log('The current context is ' + ctx.value);
                    })
                    .setContext(contextsAndroid[1])
                    .useCss()
                    .waitForElementVisible(selectors.previewButton)

                    // Checking window handle
                    .windowHandle(function(h) {
                        browser.log('Window handle before clicking preview ' + h.value);
                    })
                    .click(selectors.previewButton)
                    //This is only needed if using an adaptive build
                    .pause(3000)
                    .waitUntilMobified();
            } else if (!isAndroid(type.value.platform)) {
                browser.log('these are the contexts ' + result.value);
                var contextsiOS = result.value.slice(2);
                browser
                    .log('Starting Preview Process iOS')
                    .currentContext(function(ctx) {
                        browser.log('The current context is ' + ctx.value);
                    })
                    .setContext(contextsiOS[contextsiOS.length - 1]) 
                    .currentContext(function(ctx) {
                        browser.log('The context after switching is ' + ctx.value);
                    })
                    .url(function(url) {
                        browser.log('Print the URL ' + url.value);
                    })
                    .useCss()
                    .waitForElementVisible(selectors.previewButton)
                    //waits to ensure button fully loaded and context is available
                    .pause(2000)
                    .click(selectors.previewButton)
                    //This is only needed if using an adaptive build
                    .waitUntilMobified()
                    //Wait for context to be available
                    .pause(3000);
            }
        });
    });
};

Setup.ensurePreviewed = function(browser) {
    browser.session(function(type) {
        if (isAndroid(type.value.platform)) {
            browser.log('Running on platform - ' + type.value.platform);
            browser.windowHandle(function(h) {
                browser.log('Window handle after Preview ' + h.value);
            });
            browser.windowHandles(function(result) {
                browser.log('Print all the window handles ');
                browser.log(result.value);
                browser.waitUntilMobified();
            });
        }
    });

    browser.contexts(function(result) {
        browser
            .log(result.value)
            .useCss()
            .log('Preview Complete');
    });
};

Setup.getContextNames = function(browser) {
    // IF URL CHANGES BASED ON ENVIRONMENT MATCH THEM HERE
    if (Site.activeProfile === 'staging') {
        browser.log('Tests Running Against Staging URLS');
        //UPDATE THIS URL FOR YOUR PROJECT
        expected.homeUrl = /<YOUR STAGING HOME URL>/i;
    } else {
        browser.log('Tests Running Against Production URLS');
        //UPDATE THIS URL FOR YOUR PROJECT
        expected.homeUrl = /https:\/\/\www\.YOUR_PRODUCTION_HOME_URL\.com/i;
    }
    // Iterate through contexts
    browser.contexts(function(result) {
        // Native context is at index 0
        // Astro worker context is at index 1
        var webContexts = result.value.slice(2);
        browser.log('Checking ' + webContexts.length + ' webviews.');
        webContexts.forEach(function(context) {
            browser
                .setContext(context)
                .pause(2000)
                .url(function(result) {
                    var contextUrl = result.value;
                    browser.log(contextUrl);
                    if (expected.noInternet.test(contextUrl)) {
                        browser.globals.contexts.NO_INTERNET = context;
                    } else if (expected.couldNotLoad.test(contextUrl)) {
                        browser.globals.contexts.COULD_NOT_LOAD = context;
                    } else if (expected.homeUrl.test(contextUrl)) {
                        browser.globals.contexts.HOME = context;
                    }
                    // ADD MORE WEBVIEWS HERE, PLEASE KEEP HOMEURL TO THE LAST ONE
                });
            });
        browser.log(browser.globals.contexts);
    });

    return browser;
};

module.exports = Setup;
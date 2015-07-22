module.exports = {
    setUp: function(browser) {
        browser
          .pause(3000)
          .contexts(function(result) {
          	browser.log(result.value);
          })
    },

    'Verify webview is pointing to Google': function(browser) {
        browser
          .contexts(function (result) {
            browser
              .setContext(result.value[result.value.length - 1])
                .url(function(url) {
                  browser.log(url.value);
                })
              .assert.urlContains('google')
            })
          .end();
        }
};

module.exports = {
  setUp: function(browser) {
      browser
      .pause(3000)
      .contexts(function(result) {
          browser.log(result.value);
      });
  },

  'Verify webview URL': function(browser) {
      browser
      .contexts(function(result) {
          browser
          .setContext(result.value[result.value.length - 1])
          .url(function(url) {
              browser.log(url.value);
          })
          .assert.urlContains('https://webpush-you-host.mobifydemo.io/about/');
      })
      .end();
  }
};

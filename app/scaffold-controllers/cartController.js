define([
    'bluebird',
    'plugins/webViewPlugin'
],
/* eslint-disable */
function(
    Promise,
    WebViewPlugin
) {
/* eslint-enable */

    var CartController = function(webView) {
        this.webView = webView;
    };

    CartController.init = function() {
        var webViewPromise = WebViewPlugin.init();

        return webViewPromise.then(function(webView) {
            webView.navigate('https://webpush-you-host.mobifydemo.io/cart/');

            return new CartController(webView);
        });
    };

    return CartController;
});

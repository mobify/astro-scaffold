define([
    'bluebird',
    'config/baseConfig',
    'config/cartConfig',
    'plugins/webViewPlugin',
    'plugins/anchoredLayoutPlugin',
    'plugins/loaders/defaultLoaderPlugin',
    'scaffold-controllers/cartHeaderController'
],
/* eslint-disable */
function(
    Promise,
    BaseConfig,
    CartConfig,
    WebViewPlugin,
    AnchoredLayoutPlugin,
    LoaderPlugin,
    CartHeaderController
) {
/* eslint-enable */

    var CartController = function(headerController, layout, webView) {
        this.viewPlugin = layout;

        this.webView = webView;
        this.headerController = headerController;
    };

    CartController.init = function() {
        var webViewPromise = WebViewPlugin.init();
        return Promise.join(
            CartHeaderController.init(),
            AnchoredLayoutPlugin.init(),
            WebViewPlugin.init(),
        function(headerController, layout, webView) {
            var loader = webView.getLoader();
            loader.setColor(BaseConfig.colors.primaryColor);
            webView.navigate(CartConfig.url);

            layout.addTopView(headerController.viewPlugin);
            layout.setContentView(webView);

            return new CartController(headerController, layout, webView);
        });
    };

    CartController.prototype.registerCloseEventHandler = function(callback) {
        if (!callback) {
            return;
        }
        this.headerController.registerCloseEventHandler(callback);
    };

    CartController.prototype.navigate = function(url) {
        this.webView.navigate(url);
    };

    CartController.prototype.reload = function() {
        this.webView.navigate(CartConfig.url);
    };

    return CartController;
});

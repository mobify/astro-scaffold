define([
    'bluebird',
    'plugins/anchoredLayoutPlugin',
    'plugins/headerBarPlugin',
    'plugins/webViewPlugin'
],
/* eslint-disable */
function(
    Promise,
    AnchoredLayoutPlugin,
    HeaderBarPlugin,
    WebViewPlugin
) {
/* eslint-enable */

    var CartController = function(webView) {
        this.webView = webView;
    };

    CartController.init = function(displayHeaderBar) {
        var webViewPromise = WebViewPlugin.init();

        return webViewPromise.then(function(webView) {
            webView.navigate('https://webpush-you-host.mobifydemo.io/cart/');

            return new CartController(webView);
        });

        // var layoutPromise;
        // if (displayHeaderBar) {
        //     layoutPromise = Promise.join(webViewPromise,
        //         AnchoredLayoutPlugin.init(),
        //         HeaderBarPlugin.init(),
        //     function(webView, anchoredLayout, headerBar) {
        //
        //     });
        // } else {
        //     layoutPromise = webViewPromise;
        // }

        // return Promise.join(
        //     AnchoredLayoutPlugin.init(),
        //     NavigationHeaderController.init(),
        //     NavigationPlugin.init(),
        //     function(layout, navigationHeaderController, navigationView) {
        //         // Add Header Bar
        //         navigationView.setHeaderBar(navigationHeaderController.viewPlugin);
        //         layout.addTopView(navigationHeaderController.viewPlugin);
        //         navigationHeaderController.registerBackEvents(function() {
        //             navigationView.back();
        //         });
        //
        //         var drawerIconEnabled = drawerEventHandler !== undefined;
        //         if (drawerIconEnabled) {
        //             navigationHeaderController.registerDrawerEvents(drawerEventHandler);
        //         }
        //
        //         layout.setContentView(navigationView);
        //
        //         return new CartController();
        //     }
        // );
    };

    return CartController;
});

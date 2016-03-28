define([
    'astro-full',
    'app-rpc',
    'bluebird',
    'config/baseConfig',
    'config/welcomeConfig',
    'plugins/WebViewPlugin',
    'plugins/navigationPlugin',
    'plugins/anchoredLayoutPlugin',
    'scaffold-controllers/welcome-screen/welcomeHeaderController'
],
/* eslint-disable */
function(
    Astro,
    AppRpc,
    Promise,
    BaseConfig,
    WelcomeConfig,
    WebViewPlugin,
    NavigationPlugin,
    AnchoredLayoutPlugin,
    WelcomeHeaderController
) {
/* eslint-enable */
    var WelcomeController = function(navigationView, layout, headerController) {
        this.viewPlugin = layout;

        this.navigationView = navigationView;
        this.headerController = headerController;
    };

    WelcomeController.init = function() {
        // To hook up your own custom native welcome plugin, you can
        // modify the initializers below and either:
        //
        //  1. With a NavigationPlugin, use the navigationView and
        //     call the `navigateToPlugin()` method to navigate to
        //     your custom plugin.
        //  2. Without using a NavigationPlugin or WebViewPlugin,
        //     set the custom plugin as the content view of the layout.

        // With a header bar, we use a navigationPlugin to handle
        // navigation and stacking animations.
        var initWithHeader = function() {
            return Promise.join(
                NavigationPlugin.init(),
                AnchoredLayoutPlugin.init(),
                WelcomeHeaderController.init(),
            function(navigationView, layout, headerController) {
                var loader = navigationView.getLoader();
                loader.setColor(BaseConfig.loaderColor);
                navigationView.setHeaderBar(headerController.viewPlugin);
                headerController.registerBackEventHandler(function() {
                    navigationView.back();
                });

                // Remove this line if you wish to enable scrolling
                // in your welcome screen
                navigationView.disableScrolling();

                layout.addTopView(headerController.viewPlugin);
                layout.setContentView(navigationView);

                var welcomeController = new WelcomeController(navigationView, layout, headerController);
                welcomeController.navigate(WelcomeConfig.url);
                return welcomeController;
            });
        };

        // To navigate without stacking, we use a WebViewPlugin to
        // handle navigation -- desired behaviour w/o header
        var initWithoutHeader = function() {
            return Promise.join(
                WebViewPlugin.init(),
                AnchoredLayoutPlugin.init(),
            function(webView, layout) {
                var loader = webView.getLoader();
                loader.setColor(BaseConfig.loaderColor);
                layout.setContentView(webView);

                // Remove this line to enable scrolling on welcome screen
                webView.disableScrolling();

                var welcomeController = new WelcomeController(webView, layout);
                welcomeController.navigate(WelcomeConfig.url);

                return welcomeController;
            });
        };

        Astro.registerRpcMethod(AppRpc.names.welcomeHasHeader, [], function(res) {
            res.send(null, WelcomeConfig.showHeader);
        });

        return (WelcomeConfig.showHeader)
            ? initWithHeader()
            : initWithoutHeader();
    };

    WelcomeController.prototype.registerCloseEventHandler = function (callback) {
        if (!callback) {
            return;
        }
        if (this.headerController) {
            this.headerController.registerCloseEventHandler(callback);
        }
    };

    WelcomeController.prototype.navigate = function(url) {
        if (!url) {
            return;
        }

        var self = this;
        // Without a header controller, we do not need to generate header
        // content for the navigation. Instead, we allow the webView to
        // simply navigate.
        if (!self.headerController) {
            self.navigationView.navigate(url);
            return;
        }

        var navigationHandler = function(params) {
            var url = params.url;
            // We're expected to navigate the web view if we're called with a
            // url and the web view isn't in the process of redirecting (i.e.
            // `params.isCurrentlyLoading` is not set).
            if (!!url && !params.isCurrentlyLoading) {
                self.navigate(url);
            }
        };

        self.headerController.generateContent().then(function(headerContent) {
            return self.navigationView.navigateToUrl(url, headerContent, {navigationHandler: navigationHandler});
        });
    };

    WelcomeController.prototype.back = function() {
        this.navigationView.back();
    };

    WelcomeController.prototype.canGoBack = function() {
        return this.navigationView.canGoBack();
    };

    return WelcomeController;
});

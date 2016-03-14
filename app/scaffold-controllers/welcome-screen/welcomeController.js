define([
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
        console.log('viewPlugin set:', this.viewPlugin);

        this.navigationView = navigationView;
        this.headerController = headerController;
        this.navigate(WelcomeConfig.url);
    };

    WelcomeController.init = function() {
        // With a header bar, we use a navigationPlugin to handle
        // navigation and stacking animations
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

                layout.addTopView(headerController.viewPlugin);
                layout.setContentView(navigationView);

                return new WelcomeController(navigationView, layout, headerController);
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

                return new WelcomeController(webView, layout);
            });
        };

        return (WelcomeConfig.showHeader)
            ? initWithHeader()
            : initWithoutHeader();
    };

    WelcomeController.prototype.registerCloseEventHandler = function (callback) {
        if (!callback) {
            return;
        }
        var self = this;
        if (!self.headerController) {
            // TODO: create a way for controller to dismiss
        } else {
            this.headerController.registerCloseEventHandler(callback);
        }
    };

    WelcomeController.prototype.navigate = function(url) {
        if (!url) {
            return;
        }

        var self = this;
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

    WelcomeController.prototype.hideTopViews = function() {
        this.viewPlugin.hideTopViews();
    };

    WelcomeController.prototype.showTopViews = function() {
        this.viewPlugin.showTopViews();
    };

    WelcomeController.prototype.back = function() {
        this.navigationView.back();
    };

    WelcomeController.prototype.canGoBack = function() {
        return this.navigationView.canGoBack();
    };

    return WelcomeController;
});

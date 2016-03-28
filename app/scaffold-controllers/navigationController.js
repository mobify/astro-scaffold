define([
    'astro-full',
    'bluebird',
    'application',
    'config/baseConfig',
    'plugins/anchoredLayoutPlugin',
    'plugins/navigationPlugin',
    'scaffold-controllers/navigationHeaderController'
],
/* eslint-disable */
function(
    Astro,
    Promise,
    Application,
    BaseConfig,
    AnchoredLayoutPlugin,
    NavigationPlugin,
    NavigationHeaderController
) {
/* eslint-enable */
    var NavigationController = function(tab, layout, navigationView, navigationHeaderController, includeDrawerIcon, url) {
        this.isActive = false;
        this.viewPlugin = layout;
        this.navigationView = navigationView;
        this.navigationHeaderController = navigationHeaderController;

        var self = this;
        Application.getOSInformation().then(function(osInfo) {
            if (osInfo.os === Astro.platforms.ios && BaseConfig.iosUsingTabLayout) {
                self.id = tab.id;
                self.navigate(tab.url, includeDrawerIcon);
            } else {
                self.navigate(url, includeDrawerIcon);
            }
        });
    };

    NavigationController.init = function(
        tab,
        counterBadgeController,
        cartEventHandler,
        errorController,
        drawerEventHandler,
        url
    ) {
        return Promise.join(
            AnchoredLayoutPlugin.init(),
            NavigationHeaderController.init(counterBadgeController),
            NavigationPlugin.init(),
        function(layout, navigationHeaderController, navigationView) {
            // Set layout
            layout.setContentView(navigationView);
            layout.addTopView(navigationHeaderController.viewPlugin);
            navigationView.setHeaderBar(navigationHeaderController.viewPlugin);
            navigationHeaderController.registerBackEvents(function() {
                navigationView.back();
            });

            navigationHeaderController.registerCartEvents(cartEventHandler);

            var drawerIconEnabled = drawerEventHandler !== undefined;
            if (drawerIconEnabled) {
                navigationHeaderController.registerDrawerEvents(drawerEventHandler);
            }

            var navigationController = new NavigationController(
                tab,
                layout,
                navigationView,
                navigationHeaderController,
                drawerIconEnabled,
                url
            );
            var backHandler = function() {
                navigationView.back();
            };

            var retryHandler = function(params) {
                if (!params.url) {
                    return;
                }
                var navigate = function(eventPlugin) {
                    eventPlugin.navigate(params.url);
                };
                navigationView.getEventPluginPromise(params).then(navigate);
            };

            errorController.bindToNavigator({
                navigator: navigationView,
                backHandler: backHandler,
                retryHandler: retryHandler,
                isActiveItem: navigationController.isActiveItem.bind(navigationController)
            });
            return navigationController;
        });
    };

    NavigationController.prototype.navigate = function(url, includeDrawerIcon) {
        if (!url) {
            return;
        }

        var self = this;
        var navigationHandler = function(params) {
            var url = params.url;

            // We're expected to navigate the web view if we're called with a
            // url and the web view isn't in the process of redirecting (i.e.
            // `params.isCurrentlyLoading` is not set).
            if (!!url && !params.isCurrentlyLoading) {
                self.navigate(url);
            }
        };

        self.navigationHeaderController.generateContent(includeDrawerIcon)
            .then(function(headerContent) {
                return self.navigationView.navigateToUrl(
                    url, headerContent, {navigationHandler: navigationHandler});
            })
            .then(function() {
                return self.navigationHeaderController.setTitle();
            });
    };

    NavigationController.prototype.navigateMainViewToNewRoot = function(url, title) {
        var self = this;
        this.navigationView.popToRoot({animated: true})
            .then(function() {
                return self.navigationView.getTopPlugin();
            })
            .then(function(rootWebView) {
                self.navigationHeaderController.setTitle(title);
                if (typeof rootWebView.navigate === 'function') {
                    return rootWebView.navigate(url);
                } else {
                    // Note: this code branch is untested
                    // This would be used if the root plugin is not a WebViewPlugin.
                    // In that case, we want to tell the navigation plugin to navigate instead.
                    return self.navigate(url, true);
                }
            });
    };

    NavigationController.prototype.back = function() {
        var self = this;
        self.navigationView.canGoBack().then(function(canGoBack) {
            if (canGoBack) {
                self.navigationView.back();
            } else {
                Application.closeApp();
            }
        });
    };

    NavigationController.prototype.canGoBack = function() {
        return this.navigationView.canGoBack();
    };

    NavigationController.prototype.isActiveItem = function() {
        return this.isActive;
    };

    return NavigationController;
});

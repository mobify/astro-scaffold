define([
    'astro-full',
    'app-events',
    'application',
    'bluebird',
    'config/baseConfig',
    'plugins/anchoredLayoutPlugin',
    'plugins/navigationPlugin',
    'app-controllers/navigationHeaderController',
    'app-controllers/searchBarController',
    'config/searchConfig'
],
/* eslint-disable */
function(
    Astro,
    AppEvents,
    Application,
    Promise,
    BaseConfig,
    AnchoredLayoutPlugin,
    NavigationPlugin,
    NavigationHeaderController,
    SearchBarController,
    SearchConfig
) {
/* eslint-enable */
    var NavigationController = function(id, url, layout, navigationView, navigationHeaderController, searchBarController, includeDrawerIcon) {
        this.id = id;
        this.isActive = false;
        this.viewPlugin = layout;
        this.navigationView = navigationView;
        this.navigationHeaderController = navigationHeaderController;
        this.searchBarController = searchBarController;

        this.navigate(url, includeDrawerIcon);

        var self = this;
        this.searchBarController.registerSearchSubmittedEvents(function(params) {
            var searchUrl = self.searchBarController.generateSearchUrl(params.searchTerms);
            self.navigate(searchUrl);
        });
    };

    NavigationController.init = function(
        id,
        url,
        counterBadgeController,
        cartEventHandler,
        errorController,
        drawerEventHandler
    ) {
        var layoutPromise = AnchoredLayoutPlugin.init();

        return Promise.join(
            layoutPromise,
            NavigationHeaderController.init(counterBadgeController),
            NavigationPlugin.init(),
        function(layout, navigationHeaderController, navigationView) {

            var searchBarControllerPromise = SearchBarController.init(layoutPromise, navigationHeaderController, navigationView);

            return searchBarControllerPromise.then(function(searchBarController) {
                var loader = navigationView.getLoader();
                loader.setColor(BaseConfig.loaderColor);
                // Set layout
                layout.setContentView(navigationView);
                layout.addTopView(navigationHeaderController.viewPlugin).then(function() {
                    searchBarController.addToLayout();
                    var searchBarToggleCallback = searchBarController.toggle.bind(searchBarController, {animated: true});
                    navigationHeaderController.registerSearchBarEvents(searchBarToggleCallback);
                });
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
                    id,
                    url,
                    layout,
                    navigationView,
                    navigationHeaderController,
                    searchBarController,
                    drawerIconEnabled
                );
                var handleActiveState = function(event) {
                    if (navigationController.isActive) {
                        AppEvents.once(event, function() {
                            navigationController.isActive = true;
                        });
                    }
                    navigationController.isActive = false;
                };
                AppEvents.on(AppEvents.names.welcomeShown, function() {
                    handleActiveState(AppEvents.names.welcomeHidden);
                });

                AppEvents.on(AppEvents.names.cartShown, function() {
                    handleActiveState(AppEvents.names.cartHidden);
                });

                navigationController._bindSearchEvents();

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
        });
    };

    NavigationController.prototype._bindSearchEvents = function() {
        var self = this;

        AppEvents.on(AppEvents.names.searchHidden, function() {
            self.navigationView.getTopPlugin().then(function(webView) {
                webView.trigger(AppEvents.names.searchHidden);
            });
        });

        AppEvents.on(AppEvents.names.searchShown, function() {
            self.navigationView.getTopPlugin().then(function(webView) {
                webView.trigger(AppEvents.names.searchShown);
            });
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
        if (this.searchBarController && this.searchBarController.isShowing()) {
            this.searchBarController.hide({animated: true});
        }

        var self = this;
        this.popToRoot({animated: true})
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

    NavigationController.prototype.popToRoot = function(params) {
        return this.navigationView.popToRoot(params);
    };

    NavigationController.prototype.back = function() {
        var self = this;
        if (self.searchBarController && self.searchBarController.isShowing()) {
            self.searchBarController.hide({animated: true});
        } else {
            self.navigationView.canGoBack().then(function(canGoBack) {
                if (canGoBack) {
                    self.navigationView.back();
                } else {
                    Application.closeApp();
                }
            });
        }
    };

    NavigationController.prototype.canGoBack = function() {
        return this.navigationView.canGoBack();
    };

    NavigationController.prototype.isActiveItem = function() {
        return this.isActive;
    };

    NavigationController.prototype.getTopPlugin = function() {
        return this.navigationView.getTopPlugin();
    };

    return NavigationController;
});

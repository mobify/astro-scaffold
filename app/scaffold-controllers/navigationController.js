define([
    'bluebird',
    'application',
    'plugins/anchoredLayoutPlugin',
    'plugins/navigationPlugin',
    'scaffold-controllers/navigationHeaderController',
    'scaffold-controllers/searchBarController',
    'scaffold-config/searchConfig'
],
/* eslint-disable */
function(
    Promise,
    Application,
    AnchoredLayoutPlugin,
    NavigationPlugin,
    NavigationHeaderController,
    SearchBarController,
    SearchConfig
) {
/* eslint-enable */
    var NavigationController = function(tab, layout, navigationView, navigationHeaderController, searchBarController, includeDrawerIcon) {
        this.id = tab.id;
        this.isActive = false;
        this.viewPlugin = layout;
        this.navigationView = navigationView;
        this.navigationHeaderController = navigationHeaderController;
        this.searchBarController = searchBarController;

        this.navigate(tab.url, includeDrawerIcon);

        var self = this;

        this.searchBarController.registerSearchSubmittedEvents(function(params) {
            self.navigate(self.searchBarController.generateSearchUrl(params.searchTerms));
        });
    };

    NavigationController.init = function(
        tab,
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
            SearchBarController.init(layoutPromise, SearchConfig),
        function(layout, navigationHeaderController, navigationView, searchBarController) {
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

            searchBarController.addToLayout();
            navigationHeaderController.registerSearchBarEvents(searchBarController.toggle.bind(searchBarController, true));

            var navigationController = new NavigationController(
                tab,
                layout,
                navigationView,
                navigationHeaderController,
                searchBarController,
                drawerIconEnabled
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

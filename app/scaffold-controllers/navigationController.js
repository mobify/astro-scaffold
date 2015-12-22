define([
    'bluebird',
    'plugins/anchoredLayoutPlugin',
    'plugins/navigationPlugin',
    'scaffold-controllers/tabHeaderController'
],
/* eslint-disable */
function(
    Promise,
    AnchoredLayoutPlugin,
    NavigationPlugin,
    HeaderController
) {
/* eslint-enable */
    var bindNavigation = function(navigator, navigate) {
        var navigationHandler = function(params) {
            var url = params['url'];
            var currentUrl = params['currentUrl'];

            // We're expected to navigate the web view if we're called with a
            // url and the web view isn't in the process of redirecting (i.e.
            // `params.isCurrentlyLoading` is not set).
            if (url != null && !params.isCurrentlyLoading) {
                navigate(url);
            }
        };

        navigator.on('navigate', navigationHandler);
        navigator.disableDefaultNavigationHandler();
    };

    var NavigationController = function(tab, layout, navigationView, headerController, includeDrawerIcon) {
        this.id = tab.id;
        this.navigationView = navigationView;
        this.layout = layout;
        this.headerController = headerController;

        bindNavigation(this.navigationView, this.navigate.bind(this));
        this.navigate(tab.url, includeDrawerIcon);
    };

    NavigationController.init = function(tab, drawerEventHandler) {
        return Promise.join(
            AnchoredLayoutPlugin.init(),
            HeaderController.init(),
            NavigationPlugin.init(),
            function(layout, headerController, navigationView) {
                // Add Header Bar
                navigationView.setHeaderBar(headerController.viewPlugin);
                layout.addTopView(headerController.viewPlugin);
                headerController.registerBackEvents(function() {
                    navigationView.back();
                });

                var drawerIconEnabled = drawerEventHandler !== undefined;
                if (drawerIconEnabled) {
                    headerController.registerDrawerEvents(drawerEventHandler);
                }

                layout.setContentView(navigationView);

                return new NavigationController(
                    tab,
                    layout,
                    navigationView,
                    headerController,
                    drawerIconEnabled
                );
            }
        );
    };

    NavigationController.prototype.navigate = function(url, includeDrawerIcon) {
        if (!url) {
            return;
        }

        this.headerController.generateContent(includeDrawerIcon)
            .then(function(headerContent) {
                return this.navigationView.navigate(url, headerContent);
            }.bind(this))
            .then(function() {
                return this.headerController.setTitle();
            }.bind(this));
    };

    return NavigationController;
});

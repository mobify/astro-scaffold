define([
    'bluebird',
    'plugins/anchoredLayoutPlugin',
    'plugins/navigationPlugin',
    'scaffold-controllers/navigationHeaderController'
],
/* eslint-disable */
function(
    Promise,
    AnchoredLayoutPlugin,
    NavigationPlugin,
    NavigationHeaderController
) {
/* eslint-enable */
    var bindNavigation = function(navigator, navigate) {
        var navigationHandler = function(params) {
            var url = params['url'];

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

    var NavigationController = function(tab, layout, navigationView, navigationHeaderController, includeDrawerIcon) {
        this.id = tab.id;
        this.navigationView = navigationView;
        this.layout = layout;
        this.navigationHeaderController = navigationHeaderController;

        bindNavigation(this.navigationView, this.navigate.bind(this));
        this.navigate(tab.url, includeDrawerIcon);
    };

    NavigationController.init = function(
        tab, counterBadgeController, cartEventHandler, drawerEventHandler) {
        return Promise.join(
            AnchoredLayoutPlugin.init(),
            NavigationHeaderController.init(counterBadgeController),
            NavigationPlugin.init(),
            function(layout, navigationHeaderController, navigationView) {
                // Add Header Bar
                navigationView.setHeaderBar(navigationHeaderController.viewPlugin);
                layout.addTopView(navigationHeaderController.viewPlugin);
                navigationHeaderController.registerBackEvents(function() {
                    navigationView.back();
                });

                navigationHeaderController.registerCartEvents(cartEventHandler);

                var drawerIconEnabled = drawerEventHandler !== undefined;
                if (drawerIconEnabled) {
                    navigationHeaderController.registerDrawerEvents(drawerEventHandler);
                }

                layout.setContentView(navigationView);

                return new NavigationController(
                    tab,
                    layout,
                    navigationView,
                    navigationHeaderController,
                    drawerIconEnabled
                );
            }
        );
    };

    NavigationController.prototype.navigate = function(url, includeDrawerIcon) {
        if (!url) {
            return;
        }

        var self = this;
        self.navigationHeaderController.generateContent(includeDrawerIcon)
            .then(function(headerContent) {
                return self.navigationView.navigate(url, headerContent);
            })
            .then(function() {
                return self.navigationHeaderController.setTitle();
            });
    };

    NavigationController.prototype.back = function() {
        this.navigationView.back();
    };

    return NavigationController;
});

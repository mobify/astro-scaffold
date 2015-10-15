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

    var TabController = function(tab, layout, navigationView, headerController) {
        this.id = tab.id;
        this.navigationView = navigationView;
        this.layout = layout;
        this.headerController = headerController;

        bindNavigation(this.navigationView, this.navigate);
        this.navigate(tab.url);
    };

    TabController.init = function(tab) {
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

                layout.setContentView(navigationView);

                return new TabController(
                    tab,
                    layout,
                    navigationView,
                    headerController
                );
            }
        );
    };

    TabController.prototype.navigate = function(url) {
        if (!url) {
            return;
        }

        this.headerController.generateContent()
            .then(function(headerContent) {
                return this.navigationView.navigate(url, headerContent);
            }.bind(this))
            .then(function() {
                return this.headerController.setTitle();
            }.bind(this));
    };

    return TabController;
});

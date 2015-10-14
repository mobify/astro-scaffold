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
    //var baseUrl = 'https://www.google.com/';

    var TabController = function(id, layout, navigationView) {
        this.id = id;
        this.navigationView = navigationView;
        this.layout = layout;
    };

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

                var navigate = function(url) {
                    if (!url) {
                        return;
                    }

                    headerController.generateContent()
                        .then(function(headerContent) {
                            return navigationView.navigate(url, headerContent);
                        })
                        .then(function() {
                            return headerController.setTitle();
                        });
                };

                bindNavigation(navigationView, navigate);
                navigate(tab.url);

                return new TabController(
                    tab.id,
                    layout,
                    navigationView
                );
            }
        );
    };

    return TabController;
});

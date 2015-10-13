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
    var baseUrl = 'https://www.google.com/';

    var TabController = function(id, layout, navigationView) {
        this.id = id;
        this.navigationView = navigationView;
        this.layout = layout;
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


                // Enable custom navigation behaviour
                // var includeSearchIcon = true;
                // var tabNavigation = new TabNavigation(navigationView, headerController, includeSearchIcon);
                // tabNavigation.bindTitleUpdate(tab.title);
                // tabNavigation.navigate(tab.url);

                navigationView.navigate(baseUrl);

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

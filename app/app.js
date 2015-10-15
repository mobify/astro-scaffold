window.AstroMessages = []; // For debugging messages

window.run = function() {
    require([
        'astro-full',
        'bluebird',
        'application',
        'plugins/navigationPlugin',
        'plugins/anchoredLayoutPlugin',
        'scaffold-controllers/tabBarController',
        'scaffold-components/deepLinkingServices'
    ],
    function(
        Astro,
        Promise,
        Application,
        NavigationPlugin,
        AnchoredLayoutPlugin,
        TabBarController,
        DeepLinkingServices
    ) {

        // Enter your site url here
        //var baseUrl = 'https://www.google.com/';

        var layoutPromise = AnchoredLayoutPlugin.init();
        var tabBarControllerPromise = TabBarController.init(layoutPromise);

        // Use the mainWebView as the main content view for our layout
        var layoutSetupPromise = Promise.join(
            layoutPromise,
            tabBarControllerPromise,
        function(layout, tabBarController) {
            layout.addBottomView(tabBarController.tabBar);

            //Application.setBackgroundColor(Styles.Colors.white);
            return Application.setMainViewPlugin(layout);
        });

        // Tab layout must be added as the mainViewPlugin before
        // The first tab is selected or else the navigation does
        // not complete correctly - TGI-273
        Promise.join(tabBarControllerPromise, layoutSetupPromise, function(tabBarController) {
            tabBarController.selectTab('1');

            // Deep linking services will enable deep linking on startup
            // and while running
            // It will open the deep link in the current active tab
            var deepLinkingServices = new DeepLinkingServices(tabBarController.navigateActiveTab.bind(tabBarController));

        });

    }, undefined, true);
};
// Comment out next line for JS debugging
window.run();

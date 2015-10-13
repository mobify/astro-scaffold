window.AstroMessages = []; // For debugging messages

window.run = function() {
    require([
        'astro-full',
        'bluebird',
        'application',
        'plugins/navigationPlugin',
        'plugins/anchoredLayoutPlugin',
        'scaffold-controllers/tabBarController',
    ],
    function(
        Astro,
        Promise,
        Application,
        NavigationPlugin,
        AnchoredLayoutPlugin,
        TabBarController
    ) {

        // Enter your site url here
        var baseUrl = 'https://www.google.com/';

        // *****Need to enable deep linking again ******

        // var startUriPromise = Application.getStartUri();
        //
        // // Initialize plugins
        // var mainNavigationViewPromise = NavigationPlugin.init();
        // var layoutPromise = AnchoredLayoutPlugin.init();
        //
        // // Start the app at the base url or provided start uri (deep link launch)
        // Promise.join(mainNavigationViewPromise, startUriPromise, function(mainNavigationView, uri) {
        //     if (uri != null) {
        //         mainNavigationView.navigate(uri);
        //     } else {
        //         mainNavigationView.navigate(baseUrl);
        //     }
        // });
        //
        // // Listen for deep link events once app is running
        // Application.on('receivedDeepLink', function(params) {
        //     mainNavigationViewPromise.then(function(mainNavigationView) {
        //         var uri = params.uri;
        //         if (uri != null) {
        //             mainNavigationView.navigate(uri);
        //         }
        //     });
        // });

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
        });

    }, undefined, true);
};
// Comment out next line for JS debugging
window.run();

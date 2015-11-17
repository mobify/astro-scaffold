window.AstroMessages = []; // For debugging messages

window.run = function() {
    require([
        'astro-full',
        'bluebird',
        'application',
        'plugins/navigationPlugin',
        'plugins/anchoredLayoutPlugin'
    ],
    function(
        Astro,
        Promise,
        Application,
        NavigationPlugin,
        AnchoredLayoutPlugin
    ) {

        // Enter your site url here
        var baseUrl = 'http://astro.mobify.com/';
        var startUriPromise = Application.getStartUri();

        // Initialize plugins
        var mainNavigationViewPromise = NavigationPlugin.init();
        var layoutPromise = AnchoredLayoutPlugin.init();

        // Start the app at the base url or provided start uri (deep link launch)
        Promise.join(mainNavigationViewPromise, startUriPromise, function(mainNavigationView, uri) {
            if (uri != null) {
                mainNavigationView.navigate(uri);
            } else {
                mainNavigationView.navigate(baseUrl);
            }
        });

        // Listen for deep link events once app is running
        mainNavigationViewPromise.then(function(mainNavigationView) {
            Application.on('receivedDeepLink', function(params) {
                var uri = params.uri;
                if (uri != null) {
                    mainNavigationView.navigate(uri);
                }
            });
            // Wiring up the hardware back button for Android
            Application.on('onKeyDown', function(params) {
                mainNavigationView.back();
            });
        });

        // Use the mainNavigationView as the main content view for our layout
        Promise.join(layoutPromise, mainNavigationViewPromise, function(layout, mainNavigationView) {
            layout.setContentView(mainNavigationView);
        });

        // Set the main view as the layout
        layoutPromise.then(function(layout) {
            Application.setMainViewPlugin(layout);
        });

    }, undefined, true);
};
// Comment out next line for JS debugging
window.run();

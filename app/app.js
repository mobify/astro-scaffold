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
    var baseUrl = 'http://www.google.com/';
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
    Application.on('receivedDeepLink', function(params) {
        mainNavigationViewPromise.then(function(mainNavigationView) {
            var uri = params.uri;
            if (uri != null) {
                mainNavigationView.navigate(uri);
            }
        });
    });

    // Use the mainNavigationView as the main content view for our layout
    Promise.join(layoutPromise, mainNavigationViewPromise, function(layout, mainNavigationView) {
        layout.setContentView(mainNavigationView);
    });

    // Route all unhandled key presses to the mainNavigationView
    mainNavigationViewPromise.then(function(mainNavigationView) {
        Application.setMainInputPlugin(mainNavigationView);
    });

    layoutPromise.then(function(layout) {
        Application.setMainViewPlugin(layout);
    });

}, undefined, true);

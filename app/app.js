require([
    'astro-full',
    'bluebird',
    'application',
    'plugins/webViewPlugin',
    'plugins/anchoredLayoutPlugin'
],
function(
    Astro,
    Promise,
    Application,
    WebViewPlugin,
    AnchoredLayoutPlugin
) {

    // Enter your site url here
    var baseUrl = 'http://www.google.com/';
    var startUriPromise = Application.getStartUri();

    // Initialize plugins
    var mainWebViewPromise = WebViewPlugin.init();
    var layoutPromise = AnchoredLayoutPlugin.init();

    // Start the app at the base url or provided start uri (deep link launch)
    mainWebViewPromise.then(function(mainWebView) {
        startUriPromise.then(function(uri) {
            if (uri != null) {
                try {
                    mainWebView.navigate(uri.replace(/^.+?:\/\/*/, ''));
                } catch (err) {
                    mainWebView.navigate(baseUrl);
                }
            } else {
                mainWebView.navigate(baseUrl);
            }
        });
    });

    // Use the mainWebView as the main content view for our layout
    Promise.join(layoutPromise, mainWebViewPromise, function(layout, mainWebView) {
        layout.setContentView(mainWebView);
    });

    // Route all unhandled key presses to the mainWebView
    mainWebViewPromise.then(function(mainWebView) {
        Application.setMainInputPlugin(mainWebView);
    });

    layoutPromise.then(function(layout) {
        Application.setMainViewPlugin(layout);
    });

}, undefined, true);

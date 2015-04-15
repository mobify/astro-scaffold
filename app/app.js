require([
    'astro',
    'bluebird',
    'plugins/applicationPlugin',
    'plugins/webViewPlugin',
    'plugins/anchoredLayoutPlugin'
],
function(
    Astro,
    Promise,
    ApplicationPlugin,
    WebViewPlugin,
    AnchoredLayoutPlugin
) {

    // Enter your site url here
    var baseUrl = 'http://www.google.com/';

    // Initialize plugins
    var applicationPromise = ApplicationPlugin.init();
    var mainWebViewPromise = WebViewPlugin.init();
    var layoutPromise = AnchoredLayoutPlugin.init();

    // Start the app at the base url
    mainWebViewPromise.then(function(mainWebView) {
        mainWebView.navigate(baseUrl);
    });

    // Use the mainWebView as the main content view for our layout
    Promise.join(layoutPromise, mainWebViewPromise, function(layout, mainWebView) {
        layout.setContentView(mainWebView.address);
    });

    // Route all unhandled key presses to the mainWebView
    Promise.join(applicationPromise, mainWebViewPromise, function(application, mainWebView){
        application.setMainInputPlugin(mainWebView.address);
    });

    Promise.join(applicationPromise, layoutPromise, function(application, layout) {
        application.setMainViewPlugin(layout.address);
    });

}, undefined, true);

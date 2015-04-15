require([
    'astro',
    'bluebird',
    'plugins/applicationPlugin',
    'plugins/splashScreenPlugin',
    'plugins/drawerPlugin',
    'plugins/webViewPlugin',
    'plugins/anchoredLayoutPlugin',
    'plugins/headerBarPlugin'
],
function(
     Astro,
     Promise,
     ApplicationPlugin,
     SplashScreenPlugin,
     DrawerPlugin,
     WebViewPlugin,
     AnchoredLayoutPlugin,
     HeaderBarPlugin
) {
var COG_ICON_URL = 'file://cog.png';
var BAG_ICON_URL = 'file://bag_0.png';
var LOGO_ICON_URL = 'file://logo.png';
var BACKGROUND_URL = 'file://btr_navigation_bar_background.png';

window.run = function() {

    var applicationPromise = ApplicationPlugin.init()

    var splashPromise = SplashScreenPlugin.init().then(function(splashScreen) {
        splashScreen.setColor("#F7F7F7");
        splashScreen.setSplashImage("astro-demo-splash.png");
        splashScreen.show();

        return splashScreen;
    }).delay(2000);


    var layoutPromise = Promise.all([applicationPromise, AnchoredLayoutPlugin.init()])
        .spread(function(applicationPlugin, layoutPlugin){
        applicationPlugin.setMainViewPlugin(layoutPlugin.address);
        return layoutPlugin;
    });

    var ballerPromise = WebViewPlugin.init().then(function(ballerWebView) {
        ballerWebView.navigate('http://www2.warnerbros.com/spacejam/movie/jam.htm');
        return ballerWebView;
    });

    WebViewPlugin.init().then(function(mainWebView) {
        mainWebView.navigate('http://www.mobify.com');

        layoutPromise.then(function(layoutPlugin) {
            layoutPlugin.setContentView(mainWebView.address);
        });
    });

    var headerPromise = HeaderBarPlugin.init().then(function(headerBar) {
        var loadIconPromise = Promise.all([
            headerBar.setLeftIcon(COG_ICON_URL),
            headerBar.setRightIcon(BAG_ICON_URL),
            headerBar.setCenterIcon(LOGO_ICON_URL),
            headerBar.setBackground(BACKGROUND_URL),
        ]);

        return { headerBar: headerBar, loadIconPromise: loadIconPromise }
    });

    Promise.join(layoutPromise, headerPromise, splashPromise,
        function(layoutPlugin, headerPromiseResult, splashScreen) {
        var headerBar = headerPromiseResult.headerBar;
        var loadIconPromise = headerPromiseResult.loadIconPromise;
        loadIconPromise.then(function() {
            layoutPlugin.addTopView(headerBar.address);
            splashScreen.hide();
            headerBar.show();
            ballerPromise.then(function(ballerWebView){
                layoutPlugin.addTopViewWithSize(ballerWebView.address, 48);
            });
        });
    });

    var leftWebViewPromise = WebViewPlugin.init().then(function(leftWebView){
        leftWebView.navigate("http://www.reddit.com/.compact").then(function() {
            console.log('Left Navigated!');
        });

        return leftWebView;
    });

    var rightWebViewPromise = WebViewPlugin.init().then(function(rightWebView) {
        rightWebView.navigate("https://news.ycombinator.com").then(function(){
            console.log('Right Navigated!');
        });
        return rightWebView;
    });

    var drawerPromise = layoutPromise.then(function() {
        DrawerPlugin.init().then(function(drawer) {
            leftWebViewPromise.then(function(leftWebView) {
                leftMenu = window.leftMenu = drawer.initLeftMenu(leftWebView);

                headerPromise.then(function(headerPromiseResult) {
                    headerPromiseResult.headerBar.on('leftIconClick', function() {
                        leftMenu.toggle();
                    });
                });
            });

            rightWebViewPromise.then(function(rightWebView) {
                rightMenu = window.rightMenu = drawer.initRightMenu(rightWebView);

                headerPromise.then(function(headerPromiseResult) {
                    headerPromiseResult.headerBar.on('rightIconClick', function() {
                        rightMenu.toggle();
                    });
                });
            });
            return drawer;
        });
    });
};
run();
}, undefined, true);

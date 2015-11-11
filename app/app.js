window.AstroMessages = []; // For debugging messages

window.run = function() {
    require([
        'astro-full',
        'bluebird',
        'application',
        'app-config',
        'plugins/webViewPlugin',
        'plugins/anchoredLayoutPlugin',
        'plugins/navigationPlugin',
        'plugins/headerBarPlugin',
        'plugins/drawerPlugin'
    ],
    function(
        Astro,
        Promise,
        Application,
        Config,
        WebViewPlugin,
        AnchoredLayoutPlugin,
        NavigationPlugin,
        HeaderBarPlugin,
        DrawerPlugin
    ) {

        // Enter your site url here
        var baseUrl = Config.mainWebView.url;

        // Initialize plugins
        var mainNavigationPromise = NavigationPlugin.init();
        var layoutPromise         = AnchoredLayoutPlugin.init();
        var headerPromise         = HeaderBarPlugin.init();
        var drawerPromise         = DrawerPlugin.init();
        var cartWebViewPromise    = WebViewPlugin.init();
        var leftDrawerWebViewPromise = WebViewPlugin.init();

        Promise.join(mainNavigationPromise, headerPromise, function(mainNavigationView, headerBar) {
            // Set up the header bar
            headerBar.setBackgroundColor('#FFFFFF');
            headerBar.setTextColor('#333333');
            headerBar.show();

            // Now, let's hook up the main navigation to the header bar
            mainNavigationView.setHeaderBar(headerBar);

            // Navigate to the base url
            mainNavigationView.navigate(baseUrl, {
                header: {
                    leftIcon: {
                        id: 'account',
                        imageUrl: 'file:///account.png'
                    },
                    centerIcon: {
                        id: 'logo',
                        imageUrl: 'file:///logo.png'
                    },
                    rightIcon: {
                        id: 'cart',
                        imageUrl: 'file:///cart.png'
                    }
                }
            });

            // iOS: When the back button is pressed navigate back
            headerBar.on('click:back', function() {
                mainNavigationView.back();
            });

            // Android: Set the icons and configure the back button
            if (/android/i.test(navigator.userAgent)) {
                headerBar.setLeftIcon(baseUrl + '/images/account.png', 'account');
                headerBar.setCenterIcon(baseUrl + '/images/logo.png', 'logo');
                headerBar.setRightIcon(baseUrl + '/images/cart.png', 'cart');

                Application.on('onKeyDown', function(params) {
                    if (params.keyCode === 4) {
                        mainNavigationView.back();
                    }
                });
            }
        });

        // Use the mainNavigationView as the main content view for our layout
        Promise.join(layoutPromise, mainNavigationPromise, function(layout, mainNavigationView) {
            layout.setContentView(mainNavigationView);
        });

        // Add the header bar once `layoutPromise` and `headerPromise` are fulfilled.
        Promise.join(layoutPromise, headerPromise, function(layout, headerBar) {
            layout.addTopView(headerBar);
        });

        // Set the drawer's content area once `drawerPromise` and `layoutPromise` are fulfilled.
        Promise.join(drawerPromise, layoutPromise, function(drawer, layout) {
            drawer.setContentView(layout);
        });

        // Set our layout as the main view of the app
        drawerPromise.then(function(drawer) {
            Application.setMainViewPlugin(drawer);
        });

        // Navigate the cart webview to the right url
        cartWebViewPromise.then(function(webView) {
            webView.navigate(baseUrl + '/cart');
            webView.setBackgroundColor('#FFFFFF');
            // Disable navigation when links are pressed
            webView.disableDefaultNavigationHandler();
        });

        // Set the right drawer view to the cart web view instance once the promises have been fulfilled.
        var rightDrawerPromise = Promise.join(cartWebViewPromise, drawerPromise, function(cartWebView, drawer) {
            var rightDrawer = drawer.initRightMenu(cartWebView);
            // We want the right drawer later, so we will return it
            return rightDrawer;
        });

        // Open the right drawer when the cart button is clicked
        Promise.join(rightDrawerPromise, headerPromise, function(rightDrawer, header) {
            header.on('click:cart', function() {
                rightDrawer.toggle();
            });
        });

        // Add a handler on the main web view to open drawer when 'addToCartClicked' event happens.
        Promise.join(mainNavigationPromise,
                        rightDrawerPromise,
                        cartWebViewPromise,
                        function(mainNavigationView, rightDrawer, cartWebView) {
            mainNavigationView.on('addToCartClicked', function() {
                // Open the right drawer
                rightDrawer.open();
                // Let the cart view know that something has been added
                cartWebView.trigger('cartUpdated');
            });
        });

        // ---------- LEFT DRAWER SETUP

        // Navigate the cart webview to the right url
        leftDrawerWebViewPromise.then(function(webView) {
            webView.navigate('file:///local_www/left_menu.html');
            webView.setBackgroundColor('#FFFFFF');
            // Disable navigation when links are pressed
            webView.disableDefaultNavigationHandler();
        });

        var leftDrawerPromise = Promise.join(leftDrawerWebViewPromise, drawerPromise, function(menuWebView, drawer) {
            var leftDrawer = drawer.initLeftMenu(menuWebView);
            return leftDrawer;
        });

        Promise.join(leftDrawerPromise, headerPromise, function(leftDrawer, header) {
            header.on('click:account', function() {
                leftDrawer.toggle();
            });
        });

        Promise.join(mainNavigationPromise,
                        leftDrawerPromise,
                        leftDrawerWebViewPromise,
                        function(mainNavigationView, rightDrawer, menuWebView) {
            mainNavigationView.on('addToCartClicked', function() {
                // Open the right drawer
                rightDrawer.open();
                // Let the cart view know that something has been added
                // menuWebView.trigger('cartUpdated');
            });
        });

        Promise.join(mainNavigationPromise, leftDrawerWebViewPromise, leftDrawerPromise, function(mainNavigationView, leftWebView, leftMenu) {
            // LOKITODO:
            leftWebView.on('navitron__astro-link', function(url) {
                leftMenu.toggle();
                mainNavigationView.navigate(url,  { stack: false } );
            });
        });


    }, undefined, true);
};
// Comment out next line for JS debugging
window.run();
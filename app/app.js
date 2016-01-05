window.AstroMessages = []; // For debugging messages

window.run = function() {
    require([
        'astro-full',
        'bluebird',
        'application',
        'plugins/anchoredLayoutPlugin',
        'scaffold-controllers/tabBarController',
        'scaffold-controllers/drawerController',
        'scaffold-controllers/cartModalController',
        'scaffold-components/deepLinkingServices',
    ],
    function(
        Astro,
        Promise,
        Application,
        AnchoredLayoutPlugin,
        TabBarController,
        DrawerController,
        CartModalController,
        DeepLinkingServices
    ) {

        var setupIosLayout = function() {
            var layoutPromise = AnchoredLayoutPlugin.init();
            var cartModalControllerPromise = CartModalController.init();
            var cartEventHandlerPromise = cartModalControllerPromise.then(
            function(cartModalController) {
                return function() {
                    cartModalController.show();
                };
            });

            return Promise.join(
                layoutPromise,
                TabBarController.init(layoutPromise, cartEventHandlerPromise),
            function(layout, tabBarController) {
                layout.addBottomView(tabBarController.tabBar);

                //Application.setBackgroundColor(Styles.Colors.white);
                Application.setMainViewPlugin(layout);

                return tabBarController;
            }).then(function(tabBarController) {
                // Tab layout must be added as the mainViewPlugin before
                // The first tab is selected or else the navigation does
                // not complete correctly
                tabBarController.selectTab('1');
                return tabBarController;
            });
        };

        var setupAndroidLayout = function() {
            return DrawerController.init().then(function(drawerController) {
                Application.setMainViewPlugin(drawerController.drawer);

                // Wiring up the hardware back button for Android
                Application.on('onKeyDown', function(params) {
                    drawerController.backActiveItem();
                });

                return drawerController;
            }).then(function(drawerController) {
                drawerController.selectItem('1');
                return drawerController;
            });
        };

        Application.getOSInformation().then(
        function(osInfo) {
            if (osInfo.os === Astro.platforms.ios) {
                return setupIosLayout();
            }

            return setupAndroidLayout();
        }).then(function(menuController) {
            // Deep linking services will enable deep linking on startup
            // and while running
            // It will open the deep link in the current active tab
            var deepLinkingServices = new DeepLinkingServices(menuController);
        });

    }, undefined, true);
};
// Comment out next line for JS debugging
window.run();

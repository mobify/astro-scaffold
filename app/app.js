window.AstroMessages = []; // For debugging messages

window.run = function() {
    require([
        'astro-full',
        'astro-events',
        'bluebird',
        'application',
        'plugins/anchoredLayoutPlugin',
        'controllers/counterBadgeController',
        'scaffold-controllers/tabBarController',
        'scaffold-controllers/drawerController',
        'scaffold-controllers/cartModalController',
        'scaffold-components/deepLinkingServices',
        'config/headerConfig'
    ],
    function(
        Astro,
        AstroEvents,
        Promise,
        Application,
        AnchoredLayoutPlugin,
        CounterBadgeController,
        TabBarController,
        DrawerController,
        CartModalController,
        DeepLinkingServices,
        HeaderConfig
    ) {

        var setupIosLayout = function(counterBadgeControllerPromise) {
            var layoutPromise = AnchoredLayoutPlugin.init();
            var cartModalControllerPromise = CartModalController.init();
            var cartEventHandlerPromise = cartModalControllerPromise.then(
            function(cartModalController) {
                return function() {
                    cartModalController.show();
                };
            });

            var tabBarControllerPromise = TabBarController.init(
                layoutPromise, cartEventHandlerPromise, counterBadgeControllerPromise);

            var layoutSetupPromise = Promise.join(
                layoutPromise,
                tabBarControllerPromise,
            function(layout, tabBarController) {
                layout.addBottomView(tabBarController.tabBar);

                return Application.setMainViewPlugin(layout);
            });

            // Tab layout must be added as the mainViewPlugin before
            // The first tab is selected or else the navigation does
            // not complete correctly
            return Promise.join(tabBarControllerPromise, layoutSetupPromise,
            function(tabBarController) {
                tabBarController.selectTab('1');
                return tabBarController;
            });
        };

        var setupAndroidLayout = function(counterBadgeControllerPromise) {
            return DrawerController.init(counterBadgeControllerPromise).then(
            function(drawerController) {
                Application.setMainViewPlugin(drawerController.drawer);

                // Wiring up the hardware back button for Android
                Application.on('backButtonPressed', function() {
                    AstroEvents.cartShowing().then(function(cartShowing) {
                        if (cartShowing) {
                            AstroEvents.closeCart();
                        } else {
                            drawerController.backActiveItem();
                        }
                    });
                });

                return drawerController;
            }).then(function(drawerController) {
                drawerController.selectItem('1');
                return drawerController;
            });
        };

        var counterBadgeControllerPromise = CounterBadgeController.init(
            HeaderConfig.cartHeaderContent.imageUrl,
            HeaderConfig.cartHeaderContent.id
        ).then(function(counterBadgeController) {
            counterBadgeController.updateCounterValue(3);
            return counterBadgeController;
        });

        Application.getOSInformation().then(function(osInfo) {
            if (osInfo.os === Astro.platforms.ios) {
                return setupIosLayout(counterBadgeControllerPromise);
            }

            return setupAndroidLayout(counterBadgeControllerPromise);
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

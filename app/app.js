window.AstroMessages = []; // For debugging messages

window.run = function() {
    require([
        'astro-full',
        'astro-rpc',
        'bluebird',
        'application',
        'plugins/anchoredLayoutPlugin',
        'controllers/counterBadgeController',
        'scaffold-controllers/tabBarController',
        'scaffold-controllers/drawerController',
        'scaffold-controllers/cart/cartModalController',
        'scaffold-controllers/welcome-screen/welcomeModalController',
        'scaffold-components/deepLinkingServices',
        'config/baseConfig',
        'config/headerConfig'
    ],
    function(
        Astro,
        AstroRpc,
        Promise,
        Application,
        AnchoredLayoutPlugin,
        CounterBadgeController,
        TabBarController,
        DrawerController,
        CartModalController,
        WelcomeModalController,
        DeepLinkingServices,
        BaseConfig,
        HeaderConfig
    ) {
        var deepLinkingServices = null;
        var welcomeModalControllerPromise = WelcomeModalController.init();

        var cartModalControllerPromise = CartModalController.init();
        var cartEventHandlerPromise = cartModalControllerPromise.then(
            function(cartModalController) {
                return function() {
                    cartModalController.show();
                };
            });

        var createTabBarLayout = function(counterBadgeControllerPromise) {
            var layoutPromise = AnchoredLayoutPlugin.init();
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

        var createDrawerLayout = function(counterBadgeControllerPromise) {
            return DrawerController.init(counterBadgeControllerPromise, cartEventHandlerPromise).then(
            function(drawerController) {
                Application.setMainViewPlugin(drawerController.drawer);

                // Wiring up the hardware back button for Android
                Application.on('backButtonPressed', function() {
                    cartModalControllerPromise.then(function(cartModalController) {
                        if (cartModalController.isShowing) {
                            cartModalController.hide();
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

        welcomeModalControllerPromise.then(function(welcomeModalController) {
            // The welcome modal can be configured to show only
            // once -- on initial startup, by passing in the
            // parameter `{forced: false}` below
            welcomeModalController.show({forced: true});
        });

        Application.getOSInformation().then(function(osInfo) {
            if (osInfo.os === Astro.platforms.ios && BaseConfig.iosUsingTabLayout) {
                return createTabBarLayout(counterBadgeControllerPromise);
            }
            return createDrawerLayout(counterBadgeControllerPromise);
        }).then(function(menuController) {
            // Deep linking services will enable deep linking on startup
            // and while running
            // It will open the deep link in the current active tab
            deepLinkingServices = new DeepLinkingServices(menuController);
        });

    }, undefined, true);
};
// Comment out next line for JS debugging
window.run();

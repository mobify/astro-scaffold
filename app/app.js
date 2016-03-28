window.AstroMessages = []; // For debugging messages

window.run = function() {
    require([
        'astro-full',
        'astro-rpc',
        'bluebird',
        'application',
        'config/baseConfig',
        'config/headerConfig',
        'plugins/anchoredLayoutPlugin',
        'controllers/counterBadgeController',
        'scaffold-components/deepLinkingServices',
        'scaffold-controllers/tabBarController',
        'scaffold-controllers/drawerController',
        'scaffold-controllers/cart/cartModalController',
        'scaffold-controllers/error-screen/errorController',
        'scaffold-controllers/welcome-screen/welcomeModalController'
    ],
    function(
        Astro,
        AstroRpc,
        Promise,
        Application,
        BaseConfig,
        HeaderConfig,
        AnchoredLayoutPlugin,
        CounterBadgeController,
        DeepLinkingServices,
        TabBarController,
        DrawerController,
        CartModalController,
        ErrorController,
        WelcomeModalController
    ) {
        var deepLinkingServices = null;
        var errorControllerPromise = ErrorController.init();
        var welcomeModalControllerPromise = WelcomeModalController.init(errorControllerPromise);
        var cartModalControllerPromise = CartModalController.init(errorControllerPromise);
        var cartEventHandlerPromise = cartModalControllerPromise.then(
            function(cartModalController) {
                return function() {
                    cartModalController.show();
                };
            });

        var counterBadgeControllerPromise = CounterBadgeController.init(
            HeaderConfig.cartHeaderContent.imageUrl,
            HeaderConfig.cartHeaderContent.id
        ).then(function(counterBadgeController) {
            counterBadgeController.updateCounterValue(3);
            return counterBadgeController;
        });

        // Register RPC to expose whether it is possible to go back.
        // This is necessary to determine whether to show/hide
        // the back button on the error modal
        var registerCanGoBackRpc = function(controller) {
            Promise.join(welcomeModalControllerPromise, cartModalControllerPromise,
            function(welcomeModal, cartModal) {
                Astro.registerRpcMethod(AstroRpc.names.appCanGoBack, [], function(res) {
                    // We want to return true when the cart is showing since
                    // calling `back` is equivalent to dismissing the cart
                    if (cartModal.isShowing) {
                        res.send(null, true);
                    } else if (welcomeModal.isShowing) {
                        welcomeModal.canGoBack().then(function(canGoBack) {
                            res.send(null, canGoBack);
                        });
                    } else {
                        controller.canGoBack().then(function(canGoBack) {
                            res.send(null, canGoBack);
                        });
                    }
                });
            });
        };
        var createTabBarLayout = function() {
            var layoutPromise = AnchoredLayoutPlugin.init();
            var tabBarControllerPromise = TabBarController.init(
                    layoutPromise,
                    cartEventHandlerPromise,
                    counterBadgeControllerPromise,
                    errorControllerPromise
                );

            var layoutSetupPromise = Promise.join(
                layoutPromise,
                tabBarControllerPromise,
            function(layout, tabBarController) {
                layout.addBottomView(tabBarController.tabBar);
                Application.setMainViewPlugin(layout);
                // Tab layout must be added as the mainViewPlugin before
                // The first tab is selected or else the navigation does
                // not complete correctly
                tabBarController.selectTab('1');

                registerCanGoBackRpc(tabBarController);
                return tabBarController;
            });
        };


        var createDrawerLayout = function() {
            return DrawerController.init(
                counterBadgeControllerPromise,
                cartEventHandlerPromise,
                errorControllerPromise
            ).then(function(drawerController) {
                Application.setMainViewPlugin(drawerController.drawer);

                // Wiring up the hardware back button for Android
                Application.on('backButtonPressed', function(params) {
                    cartModalControllerPromise.then(function(cartModalController) {
                        if (cartModalController.isShowing) {
                            cartModalController.hide();
                        } else {
                            drawerController.backActiveItem();
                        }
                    });
                });

                Astro.registerRpcMethod(AstroRpc.names.navigateToNewRootView, ['url', 'title'], function(res, url, title) {
                    drawerController.navigateToNewRootView(url, title);
                    res.send(null, 'success');
                });
                registerCanGoBackRpc(drawerController);

                return drawerController;
            });
        };

        Application.getOSInformation().then(function(osInfo) {
            if (osInfo.os === Astro.platforms.ios && BaseConfig.iosUsingTabLayout) {
                return createTabBarLayout(counterBadgeControllerPromise);
            }
            return createDrawerLayout(counterBadgeControllerPromise);
        }).then(function(menuController) {
            welcomeModalControllerPromise.then(function(welcomeModalController) {
                // The welcome modal can be configured to show only
                // once -- on initial startup, by passing in the
                // parameter `{forced: false}` below
                welcomeModalController.show({forced: true});
            });

            // Deep linking services will enable deep linking on startup
            // and while running
            // It will open the deep link in the current active tab
            deepLinkingServices = new DeepLinkingServices(menuController);
        });

    }, undefined, true);
};
// Comment out next line for JS debugging
window.run();

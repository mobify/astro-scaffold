window.AstroMessages = []; // For debugging messages

window.run = function() {
    require([
        'astro-full',
        'app-rpc',
        'bluebird',
        'application',
        'config/baseConfig',
        'config/headerConfig',
        'plugins/anchoredLayoutPlugin',
        'controllers/counterBadgeController',
        'app-components/deepLinkingServices',
        'app-controllers/tabBarController',
        'app-controllers/drawerController',
        'app-controllers/cart/cartModalController',
        'app-controllers/error-screen/errorController',
        'app-controllers/welcome-screen/welcomeModalController',
        'app-controllers/softAskController'
    ],
    function(
        Astro,
        AppRpc,
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
        WelcomeModalController,
        SoftAskController
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

        var mockPushPlugin = {};
        mockPushPlugin.subscribe = function() {
            console.log('subscribe for push');
        };

        var softAskControllerPromise = SoftAskController.init(Promise.resolve(mockPushPlugin));
        setTimeout(function() {
            softAskControllerPromise.then(function(softAskController) {
                softAskController.showSoftAsk('50% off', 'Would you like to receive sale notifications?');
            });
        }, 30000);

        // Register RPC to expose whether it is possible to go back.
        // This is necessary to determine whether to show/hide
        // the back button on the error modal
        var registerCanGoBackRpc = function(controller) {
            Promise.join(welcomeModalControllerPromise, cartModalControllerPromise,
            function(welcomeModal, cartModal) {
                Astro.registerRpcMethod(AppRpc.names.appCanGoBack, [], function(res) {
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

                return Application.setMainViewPlugin(layout);
            });

            // Tab layout must be added as the mainViewPlugin before
            // The first tab is selected or else the navigation does
            // not complete correctly
            return Promise.join(
                tabBarControllerPromise,
                layoutSetupPromise,
            function(tabBarController) {
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
                Application.on('backButtonPressed', function() {
                    cartModalControllerPromise.then(function(cartModalController) {
                        if (cartModalController.isShowing) {
                            cartModalController.hide();
                        } else {
                            drawerController.backActiveItem();
                        }
                    });
                });

                Astro.registerRpcMethod(AppRpc.names.navigateToNewRootView, ['url', 'title'], function(res, url, title) {
                    drawerController.navigateToNewRootView(url, title);
                    res.send(null, 'success');
                });
                registerCanGoBackRpc(drawerController);

                return drawerController;
            });
        };

        var appLayoutPromise = Application.getOSInformation().then(function(osInfo) {
            if (osInfo.os === Astro.platforms.ios && BaseConfig.iosUsingTabLayout) {
                return createTabBarLayout(counterBadgeControllerPromise);
            }
            return createDrawerLayout(counterBadgeControllerPromise);
        });

        // Show welcome modal only after layout is created for proper
        // bookkeeping of the active view.
        Promise.join(
            appLayoutPromise,
            welcomeModalControllerPromise,
        function(menuController, welcomeModalController) {
            // The welcome modal can be configured to show only
            // once -- on initial startup, by passing in the
            // parameter `{forced: false}` below
            welcomeModalController.show({forced: true});

            // Deep linking services will enable deep linking on startup
            // and while running
            // It will open the deep link in the current active tab
            deepLinkingServices = new DeepLinkingServices(menuController);
        });

    }, undefined, true);
};
// Comment out next line for JS debugging
window.run();

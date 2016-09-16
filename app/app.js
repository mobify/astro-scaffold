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
        'app-controllers/welcome-screen/welcomeModalController'
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
            // Note: The first tab will be pre-selected by tabBarPlugin by default
            return Promise.join(
                tabBarControllerPromise,
                layoutSetupPromise,
            function(tabBarController) {
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

        var createLayout = function() {
            return BaseConfig.useTabLayout
                ? createTabBarLayout()
                : createDrawerLayout();
        };

        var initMainLayout = function() {
            return createLayout().then(function(menuController) {
                // Deep linking services will enable deep linking on startup
                // and while running it will open the deep link in the current
                // active tab
                deepLinkingServices = new DeepLinkingServices(menuController);
            });
        };

        var runApp = function() {
            welcomeModalControllerPromise.then(function(welcomeModalController) {
                // The welcome modal can be configured to show only once
                // (on first launch) by setting `{forced: false}` as the
                // parameter for welcomeModalController.show()
                welcomeModalController
                    .show({forced: true})
                    .finally(initMainLayout);
            });
        };

        runApp();
    }, undefined, true);
};
// Comment out next line for JS debugging
window.run();

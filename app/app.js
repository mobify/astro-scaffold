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
        'plugins/mobifyPreviewPlugin',
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
        MobifyPreviewPlugin,
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

        // Android hardware back
        // TODO jason - test with tab layout
        var setupHardwareBackButton = function(alternativeBackFunction) {
            Application.on('backButtonPressed', function() {
                Promise.join(
                    cartModalControllerPromise,
                    errorControllerPromise,
                function(cartModalController, errorController) {
                    if (cartModalController.isShowing) {
                        cartModalController.hide();
                    } else if (errorController.isShowing) {
                        errorController.handleHardwareBackButtonPress();
                    } else {
                        alternativeBackFunction();
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
                setupHardwareBackButton(tabBarController.backActiveItem.bind(tabBarController));
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
                setupHardwareBackButton(drawerController.backActiveItem.bind(drawerController));

                Astro.registerRpcMethod(AppRpc.names.navigateToNewRootView, ['url', 'title'], function(res, url, title) {
                    drawerController.navigateToNewRootView(url, title);
                    res.send(null, 'success');
                });
                return drawerController;
            });
        };

        var createLayout = function() {
            return BaseConfig.useTabLayout
                ? createTabBarLayout()
                : createDrawerLayout();
        };

        var initMainLayout = function() {
            return createLayout().then(function(layoutController) {
                // Deep linking services will enable deep linking on startup
                // and while running it will open the deep link in the current
                // active tab
                deepLinkingServices = new DeepLinkingServices(layoutController);
            });
        };

        var runApp = function(previewedUrl) {
            // TODO: [HYB-884] As a Scaffold developer,
            // I would like for the baseURL to be set to the previewed URL

            WelcomeModalController.init(errorControllerPromise)
                .then(function(welcomeModalController) {
                    // The welcome modal can be configured to show only once
                    // (on first launch) by setting `{forced: false}` as the
                    // parameter for welcomeModalController.show()
                    welcomeModalController
                        .show({forced: true})
                        .finally(initMainLayout);
                });
        };

        var runAppPreview = function() {
            MobifyPreviewPlugin.init()
                .then(function(previewPlugin) {
                    previewPlugin
                        .preview(BaseConfig.baseURL, BaseConfig.previewBundle)
                        .then(runApp);
                });
        };

        // Configure the previewEnabled flag located in baseConfig.js
        // to enable/disable app preview
        BaseConfig.previewEnabled ? runAppPreview() : runApp();

    }, undefined, true);
};
// Comment out next line for JS debugging
window.run();

window.AstroMessages = []; // For debugging messages

window.run = function() {
    require([
        'astro-full',
        'bluebird',
        'application',
        'plugins/anchoredLayoutPlugin',
        'plugins/drawerPlugin',
        'plugins/webViewPlugin',
        'plugins/navigationPlugin',
        'scaffold-controllers/tabBarController',
        'scaffold-components/deepLinkingServices',
        'scaffold-components/tabBarConfig',
    ],
    function(
        Astro,
        Promise,
        Application,
        AnchoredLayoutPlugin,
        DrawerPlugin,
        WebViewPlugin,
        NavigationPlugin,
        TabBarController,
        DeepLinkingServices,
        TabBarConfig
    ) {

        var setupIosLayout = function() {
            var layoutPromise = AnchoredLayoutPlugin.init();
            return Promise.join(
                layoutPromise,
                TabBarController.init(layoutPromise),
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
                return tabBarController.navigateActiveTab.bind(tabBarController);
            });
        };

        var setupAndroidLayout = function() {
            return Promise.join(
                DrawerPlugin.init(),
                WebViewPlugin.init(),
                NavigationPlugin.init(),
            function(drawer, leftMenu, navigation) {
                leftMenu.navigate('file:///scaffold-www/left-menu.html');
                leftMenu.trigger('menuConfig', TabBarConfig.tabItems);

                leftMenu.disableDefaultNavigationHandler();
                leftMenu.on('navigate', function(params) {
                    if (!params.isCurrentlyLoading) {
                        drawer.hideLeftMenu();
                        navigation.navigate(params.url);
                    }
                });

                navigation.navigate(TabBarConfig.tabItems[0].url);
                drawer.setContentView(navigation);
                drawer.setLeftMenu(leftMenu);

                Application.setMainViewPlugin(drawer);

                return navigation.navigate.bind(navigation);
            });
        };

        Application.getOSInformation().then(
        function(osInfo) {
            if (osInfo.os === Astro.platforms.ios) {
                return setupIosLayout;
            }

            return setupAndroidLayout;
        }).then(function(layoutFunction) {
            return layoutFunction();
        }).then(function(navigate) {
            // Deep linking services will enable deep linking on startup
            // and while running
            // It will open the deep link in the current active tab
            var deepLinkingServices = new DeepLinkingServices(navigate);
        });

    }, undefined, true);
};
// Comment out next line for JS debugging
window.run();

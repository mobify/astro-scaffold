window.AstroMessages = []; // For debugging messages

window.run = function() {
    require([
        'astro-full',
        'bluebird',
        'application',
        'plugins/anchoredLayoutPlugin',
        'scaffold-controllers/tabBarController',
        'scaffold-controllers/drawerController',
        'scaffold-components/deepLinkingServices',
    ],
    function(
        Astro,
        Promise,
        Application,
        AnchoredLayoutPlugin,
        TabBarController,
        DrawerController,
        DeepLinkingServices
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
            return DrawerController.init().then(function(drawerController) {
                Application.setMainViewPlugin(drawerController.drawer);

                return drawerController;
            }).then(function(drawerController) {
                drawerController.selectItem('1');
                return drawerController.navigateActiveItem.bind(drawerController);
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

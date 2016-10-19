define([
    'plugins/tabBarPlugin',
    'config/tabConfig',
    'app-controllers/navigationController',
    'bluebird'
],
function(
    TabBarPlugin,
    TabConfig,
    NavigationController,
    Promise
) {

    var TabBarController = function(tabBar, layout) {
        this.tabBar = tabBar;
        this.viewPlugin = layout;
        this.activeTabId = null;

        // Set up regular tabs' layouts
        this._tabViews = {};
        this._navigationControllers = {};

        this.tabBar.setOpaque();

        // Needs to happen before tabBar is set up so we can receive the first itemSelect event
        this._bindEvents();
    };

    var initRegularTabs = function(
        controller,
        tabItems,
        cartEventHandler,
        counterBadgeController,
        errorController
    ) {
        // Make sure all tabViews are set up
        return Promise.all(tabItems.map(function(tab) {
            // Init a new NavigationController
            var navigationControllerPromise = NavigationController.init(
                tab.id,
                tab.url,
                counterBadgeController,
                cartEventHandler,
                errorController
            );
            return navigationControllerPromise.then(function(navigationController) {
                controller._navigationControllers[tab.id] = navigationController;
                controller._tabViews[tab.id] = navigationController.viewPlugin;
            });
        })).then(function() {
            controller.tabBar.setItems(tabItems);
            return controller;
        });
    };

    TabBarController.init = function(
        layoutPromise,
        cartEventHandlerPromise,
        counterBadgeControllerPromise,
        errorControllerPromise
    ) {
        var controllerPromise = Promise.join(
            TabBarPlugin.init(),
            layoutPromise,
            function(tabBar, layout) {
                return new TabBarController(tabBar, layout);
            }
        );

        var constructTabItemsPromise = Promise.resolve(TabConfig.tabItems);

        return Promise.join(
            controllerPromise,
            constructTabItemsPromise,
            cartEventHandlerPromise,
            counterBadgeControllerPromise,
            errorControllerPromise,
            initRegularTabs
        ).then(function(controller) {
            return controller;
        });
    };

    TabBarController.prototype.selectTab = function(tabId) {
        return this.tabBar.selectItem(tabId);
    };

    TabBarController.prototype._selectTabHandler = function(tabId) {
        if (this.activeTabId !== tabId) {
            // activeTabId is undefined during startup
            if (this.activeTabId) {
                this.getActiveNavigationView().isActive = false;
            }

            this.viewPlugin.setContentView(this._tabViews[tabId]);
            this.activeTabId = tabId;

            var selectedTab = this.getActiveNavigationView();
            selectedTab.isActive = true;

            if (selectedTab.needsReload()) {
                var selectedNavigationView = selectedTab.navigationView;
                Promise.join(
                    selectedNavigationView.canGoBack(),
                    selectedNavigationView.getTopPlugin(),
                    function(tabCanGoBack, topPlugin) {
                        // In the case where a tab failed its initial navigation
                        // a reload is insufficient so instead, we navigate to
                        // the tab's root URL.
                        if (!tabCanGoBack && typeof topPlugin.navigate === 'function') {
                            var tabItem = TabConfig.tabItems[tabId - 1];
                            topPlugin.navigate(tabItem.url);
                        } else {
                            topPlugin.reload();
                        }
                        selectedNavigationView.loaded = true;
                    }
                );
            }
        } else {
            this.getActiveNavigationView().popToRoot({animated: true});
        }
    };

    TabBarController.prototype.getActiveNavigationView = function() {
        return this._navigationControllers[this.activeTabId];
    };

    TabBarController.prototype._bindEvents = function() {
        var self = this;

        // Select Tab
        this.tabBar.on('itemSelect', function(data) {
            self._selectTabHandler(data.id);
        });
    };

    TabBarController.prototype.navigateActiveItem = function(url) {
        return this.getActiveNavigationView().navigate(url);
    };

    TabBarController.prototype.canGoBack = function() {
        var activeTab = this.getActiveNavigationView();
        return activeTab.canGoBack();
    };

    return TabBarController;
});

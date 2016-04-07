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

        this._bindEvents();
    };

    var configTabBar = function(tabBar, tabItems) {
        tabBar.setItems(tabItems);
        tabBar.setOpaque();

        return tabBar;
    };

    var initRegularTabs = function(
        tabBar,
        tabItems,
        cartEventHandler,
        counterBadgeController,
        errorController
    ) {
        // Set up regular tabs' layouts
        tabBar.tabViews = {};
        tabBar.NavigationControllers = {};

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
                tabBar.NavigationControllers[tab.id] = navigationController;
                tabBar.tabViews[tab.id] = navigationController.viewPlugin;

                return tabBar;
            });
        })).then(function() {
            return tabBar;
        });
    };

    TabBarController.init = function(
        layoutPromise,
        cartEventHandlerPromise,
        counterBadgeControllerPromise,
        errorControllerPromise
    ) {
        var constructTabItemsPromise = Promise.resolve(TabConfig.tabItems);

        var initTabBarPromise = Promise.join(
            TabBarPlugin.init(),
            constructTabItemsPromise,
            configTabBar);

        var initRegularTabsPromise = Promise.join(
            initTabBarPromise,
            constructTabItemsPromise,
            cartEventHandlerPromise,
            counterBadgeControllerPromise,
            errorControllerPromise,
            initRegularTabs);

        return Promise.all([initRegularTabsPromise]).then(function() {
            return Promise.join(initTabBarPromise, layoutPromise, function(tabBar, layout) {
                return new TabBarController(tabBar, layout);
            });
        });
    };

    TabBarController.prototype.selectTab = function(tabId) {
        if (this.activeTabId !== tabId) {
            // activeTabId is undefined during startup
            if (this.activeTabId) {
                this.tabBar.NavigationControllers[this.activeTabId].isActive = false;
            }

            this.viewPlugin.setContentView(this.tabBar.tabViews[tabId]);
            var selectedTab = this.tabBar.NavigationControllers[tabId];
            selectedTab.isActive = true;
            this.activeTabId = tabId;
        }
    };

    TabBarController.prototype._bindEvents = function() {
        var self = this;

        // Select Tab
        this.tabBar.on('itemSelect', function(data) {
            self.selectTab(data.id);
        });
    };

    TabBarController.prototype.navigateActiveItem = function(url) {
        this.tabBar.NavigationControllers[this.activeTabId].navigate(url);
    };

    TabBarController.prototype.canGoBack = function() {
        var activeTab = this.tabBar.NavigationControllers[this.activeTabId];
        window.message = [activeTab];
        return activeTab.canGoBack();
    };

    return TabBarController;
});

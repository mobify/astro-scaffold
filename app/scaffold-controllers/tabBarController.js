define([
    'plugins/tabBarPlugin',
    'scaffold-components/menuConfig',
    'scaffold-controllers/navigationController',
    'bluebird'
],
function(
    TabBarPlugin,
    MenuConfig,
    NavigationController,
    Promise
) {

    var TabBarController = function(tabBar, layout) {
        this.tabBar = tabBar;
        this.layout = layout;
        this.activeTabId;

        this._bindEvents();
    };

    var configTabBar = function(tabBar, tabItems) {
        tabBar.setItems(tabItems);
        tabBar.setOpaque();

        return tabBar;
    };

    var initRegularTabs = function(tabBar, tabItems, cartEventHandler) {
        // Set up regular tabs' layouts
        tabBar.tabViews = {};
        tabBar.NavigationControllers = {};

        // Make sure all tabViews are set up
        return Promise.all(tabItems.map(function(tab) {
            // Init a new NavigationController
            return NavigationController.init(tab, cartEventHandler).then(function(NavigationController) {
                tabBar.NavigationControllers[tab.id] = NavigationController;
                tabBar.tabViews[tab.id] = NavigationController.layout;

                return tabBar;
            });
        })).then(function() {
            return tabBar;
        });
    };

    TabBarController.init = function(layoutPromise, cartEventHandlerPromise) {
        var constructTabItemsPromise = Promise.resolve(MenuConfig.menuItems);

        var initTabBarPromise = Promise.join(
            TabBarPlugin.init(),
            constructTabItemsPromise,
            configTabBar);

        var initRegularTabsPromise = Promise.join(
            initTabBarPromise,
            constructTabItemsPromise,
            cartEventHandlerPromise,
            initRegularTabs);

        return Promise.all([initRegularTabsPromise]).then(function() {
            return Promise.join(initTabBarPromise, layoutPromise, function(tabBar, layout) {
                return new TabBarController(tabBar, layout);
            });
        });
    };

    TabBarController.prototype.selectTab = function(tabId) {
        if (this.activeTabId !== tabId) {
            this.layout.setContentView(this.tabBar.tabViews[tabId]);
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

    return TabBarController;
});

define([
    'plugins/tabBarPlugin',
    'plugins/navigationPlugin',
    'plugins/anchoredLayoutPlugin',
    'scaffold-components/tabBarConfig',
    'scaffold-controllers/tabController',
    'bluebird'
],
function(
    TabBarPlugin,
    NavigationPlugin,
    AnchoredLayoutPlugin,
    TabBarConfig,
    TabController,
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

    var initRegularTabs = function(tabBar, tabItems) {
        // Set up regular tabs' layouts
        tabBar.tabViews = {};
        tabBar.tabControllers = {};

        // Make sure all tabViews are set up
        return Promise.all(tabItems.map(function(tab) {
            // Init a new tabController
            return TabController.init(tab).then(function(tabController) {
                tabBar.tabControllers[tab.id] = tabController;
                tabBar.tabViews[tab.id] = tabController.layout;

                return tabBar;
            });
        })).then(function() {
            return tabBar;
        });
    };

    TabBarController.init = function(layoutPromise) {
        var constructTabItemsPromise = Promise.resolve(TabBarConfig.tabItems);

        var initTabBarPromise = Promise.join(
            TabBarPlugin.init(),
            constructTabItemsPromise,
            configTabBar);

        var initRegularTabsPromise = Promise.join(
            initTabBarPromise,
            constructTabItemsPromise,
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

    TabBarController.prototype.navigateActiveTab = function(url) {
        this.tabBar.tabControllers[this.activeTabId].navigate(url);
    };

    return TabBarController;
});

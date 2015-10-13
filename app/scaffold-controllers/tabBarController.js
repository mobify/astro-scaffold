define([
    'plugins/tabBarPlugin',
    'plugins/navigationPlugin',
    'plugins/anchoredLayoutPlugin',
    'scaffold-controllers/tabController',
    'bluebird'
],
function(
    TabBarPlugin,
    NavigationPlugin,
    AnchoredLayoutPlugin,
    TabController,
    Promise
) {

    var tabItems = [
        {id: '1', title:'One', imageUrl: 'file:///Icon__discover.png', selectedImageUrl: 'file:///Icon__discover.png'},
        {id: '2', title:'Two', imageUrl: 'file:///Icon__discover.png', selectedImageUrl: 'file:///Icon__discover.png'},
        {id: '3', title:'Three', imageUrl: 'file:///Icon__discover.png', selectedImageUrl: 'file:///Icon__discover.png'},
        {id: '4', title:'Four', imageUrl: 'file:///Icon__discover.png', selectedImageUrl: 'file:///Icon__discover.png'},
        {id: '5', title:'Five', imageUrl: 'file:///Icon__discover.png', selectedImageUrl: 'file:///Icon__discover.png'}
    ];

    var TabBarController = function(tabBar, layout) {
        this.tabBar = tabBar;
        this.layout = layout;
        this.activeTabId;

        this._bindEvents();
    };

    var configTabBar = function(tabBar, tabItemsStruct) {
        // tabBar.setColor(Styles.Colors.middle_blue_accent);
        // tabBar.setBackgroundColor(Styles.Colors.white);
        tabBar.setItems(tabItemsStruct.tabItems);
        tabBar.setOpaque();

        return tabBar;
    };

    var initRegularTabs = function(tabBar, tabItemsStruct) {
        // Set up regular tabs' layouts
        tabBar.tabViews = {};
        tabBar.tabControllers = {};

        // Make sure all tabViews are set up
        return Promise.all(tabItemsStruct.tabItems.map(function(tab) {
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
        var constructTabItemsPromise = Promise.resolve({
            tabItems: tabItems
        });

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

    return TabBarController;
});

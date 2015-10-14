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
        {id: '1', title:'Bikes', url: 'https://webpush-you-host.mobifydemo.io/', imageUrl: 'file:///Icon__discover.png', selectedImageUrl: 'file:///Icon__discover.png'},
        {id: '2', title:'Accessories', url: 'https://webpush-you-host.mobifydemo.io/accessories/', imageUrl: 'file:///Icon__discover.png', selectedImageUrl: 'file:///Icon__discover.png'},
        {id: '3', title:'Services', url: 'https://webpush-you-host.mobifydemo.io/services/', imageUrl: 'file:///Icon__discover.png', selectedImageUrl: 'file:///Icon__discover.png'},
        {id: '4', title:'Sales', url: 'https://webpush-you-host.mobifydemo.io/sales/', imageUrl: 'file:///Icon__discover.png', selectedImageUrl: 'file:///Icon__discover.png'},
        {id: '5', title:'About', url: 'https://webpush-you-host.mobifydemo.io/about/', imageUrl: 'file:///Icon__discover.png', selectedImageUrl: 'file:///Icon__discover.png'}
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

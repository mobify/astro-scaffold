define([
    'plugins/drawerPlugin',
    'plugins/webViewPlugin',
    'scaffold-components/tabBarConfig',
    'scaffold-controllers/tabController',
    'bluebird'
],
function(
    DrawerPlugin,
    WebViewPlugin,
    TabBarConfig,
    TabController,
    Promise
) {

    var retrieveItemId = function(url) {
        var parser = document.createElement('a');
        parser.href = url;
        var splitPath = parser.pathname.split('/');
        return splitPath[splitPath.length-1];
    };

    var DrawerController = function(drawer, leftMenu) {
        this.drawer = drawer;
        this.leftMenu = leftMenu;
        this.activeItemId;

        this._bindEvents();
    };

    var initLeftMenu = function(drawer, leftMenu) {
        leftMenu.navigate('file:///scaffold-www/left-menu.html');
        leftMenu.trigger('menuConfig', TabBarConfig.tabItems);

        drawer.setLeftMenu(leftMenu);

        return drawer;
    };

    var initNavigationItems = function(drawer, tabItems) {
        var drawerEventHandler = function() {
            drawer.showLeftMenu();
        };

        drawer.itemViews = {};
        drawer.itemControllers = {};

        // Make sure all tabViews are set up
        return Promise.all(tabItems.map(function(tab) {
            // Init a new tabController
            return TabController.init(tab, drawerEventHandler).then(function(tabController) {
                drawer.itemControllers[tab.id] = tabController;
                drawer.itemViews[tab.id] = tabController.layout;

                return drawer;
            });
        })).then(function() {
            return drawer;
        });
    };

    DrawerController.init = function() {
        var constructTabItemsPromise = Promise.resolve(TabBarConfig.tabItems);
        var webViewPromise = WebViewPlugin.init();

        var initLeftMenuPromise = Promise.join(
            DrawerPlugin.init(),
            webViewPromise,
            initLeftMenu);

        var initNavigationItemsPromise = Promise.join(
            initLeftMenuPromise,
            constructTabItemsPromise,
            initNavigationItems);

        return Promise.all([initNavigationItemsPromise]).then(function() {
            return Promise.join(initNavigationItemsPromise, webViewPromise, function(drawer, leftMenu) {
                return new DrawerController(drawer, leftMenu);
            });
        });
    };

    DrawerController.prototype.selectItem = function(itemId) {
        if (this.activeItemId !== itemId) {
            this.drawer.setContentView(this.drawer.itemViews[itemId]);
            this.activeItemId = itemId;
        }
    };

    DrawerController.prototype._bindEvents = function() {
        var self = this;

        this.leftMenu.disableDefaultNavigationHandler();
        this.leftMenu.on('navigate', function(params) {
            if (!params.isCurrentlyLoading) {
                self.drawer.hideLeftMenu();
                self.selectItem(retrieveItemId(params.url));
            }
        });
    };

    DrawerController.prototype.navigateActiveItem = function(url) {
        this.drawer.itemControllers[this.activeItemId].navigate(url);
    };

    return DrawerController;
});

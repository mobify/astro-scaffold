define([
    'plugins/drawerPlugin',
    'plugins/webViewPlugin',
    'scaffold-components/menuConfig',
    'scaffold-controllers/navigationController',
    'scaffold-controllers/cartController',
    'bluebird'
],
function(
    DrawerPlugin,
    WebViewPlugin,
    MenuConfig,
    NavigationController,
    CartController,
    Promise
) {

    var DrawerController = function(drawer, leftMenu) {
        this.drawer = drawer;
        this.leftMenu = leftMenu;
        this.activeItemId;

        this._bindEvents();
    };

    var initLeftMenu = function(drawer, leftMenu) {
        leftMenu.navigate('file:///scaffold-www/left-menu.html');
        leftMenu.trigger('menuConfig', MenuConfig.menuItems);

        drawer.setLeftMenu(leftMenu);

        return drawer;
    };

    var initRightMenu = function(drawer, cartController) {
        drawer.setRightMenu(cartController.webView);

        return drawer;
    };

    var initNavigationItems = function(drawer, tabItems, counterBadgeController) {
        var drawerEventHandler = function() {
            drawer.showLeftMenu();
        };

        var cartEventHandler = function() {
            drawer.showRightMenu();
        };

        drawer.itemViews = {};
        drawer.itemControllers = {};

        // Make sure all tabViews are set up
        return Promise.all(tabItems.map(function(tab) {
            // Init a new NavigationController
            return NavigationController.init(tab, counterBadgeController, cartEventHandler, drawerEventHandler).then(
            function(NavigationController) {
                drawer.itemControllers[tab.id] = NavigationController;
                drawer.itemViews[tab.id] = NavigationController.layout;

                return drawer;
            });
        })).then(function() {
            return drawer;
        });
    };

    DrawerController.init = function(counterBadgeControllerPromise) {
        var constructTabItemsPromise = Promise.resolve(MenuConfig.menuItems);
        var webViewPromise = WebViewPlugin.init();

        var initLeftMenuPromise = Promise.join(
            DrawerPlugin.init(),
            webViewPromise,
            initLeftMenu);

        var initRightMenuPromise = Promise.join(
            initLeftMenuPromise,
            CartController.init(),
            initRightMenu);

        var initNavigationItemsPromise = Promise.join(
            initRightMenuPromise,
            constructTabItemsPromise,
            counterBadgeControllerPromise,
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

        this.leftMenu.on('menuItemSelected', function(data) {
            self.drawer.hideLeftMenu();
            self.selectItem(data.id);
        });
    };

    DrawerController.prototype.navigateActiveItem = function(url) {
        this.drawer.itemControllers[this.activeItemId].navigate(url);
    };

    DrawerController.prototype.backActiveItem = function() {
        this.drawer.itemControllers[this.activeItemId].back();
    };

    return DrawerController;
});

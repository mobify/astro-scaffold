define([
    'plugins/drawerPlugin',
    'plugins/webViewPlugin',
    'config/menuConfig',
    'scaffold-controllers/navigationController',
    'scaffold-controllers/cart/cartModalController',
    'bluebird'
],
function(
    DrawerPlugin,
    WebViewPlugin,
    MenuConfig,
    NavigationController,
    CartModalController,
    Promise
) {

    var DrawerController = function(drawer, leftMenu) {
        this.drawer = drawer;
        this.leftMenu = leftMenu;
        this.activeItemId = null;

        this._bindEvents();
    };

    var initLeftMenu = function(drawer, leftMenu) {
        leftMenu.navigate('file:///scaffold-www/left-menu.html');
        leftMenu.trigger('menuConfig', MenuConfig.menuItems);

        drawer.setLeftMenu(leftMenu);

        return drawer;
    };

    var initNavigationItems = function(drawer, tabItems, counterBadgeController, cartEventHandler) {
        var drawerEventHandler = function() {
            drawer.showLeftMenu();
        };

        drawer.itemViews = {};
        drawer.itemControllers = {};

        // Make sure all tabViews are set up
        return Promise.all(tabItems.map(function(tab) {
            //Init a new NavigationController
            return cartEventHandlerPromise.then(function(cartEventHandler) {
                return NavigationController.init(tab, counterBadgeController, cartEventHandler, drawerEventHandler);
            }).then(function(navigationController) {
                        drawer.itemControllers[tab.id] = navigationController;
                        drawer.itemViews[tab.id] = navigationController.layout;

                        return drawer;
            });

        })).then(function() {
            return drawer;
        });
    };

    DrawerController.init = function(counterBadgeControllerPromise, cartEventHandler) {
        var constructTabItemsPromise = Promise.resolve(MenuConfig.menuItems);
        var webViewPromise = WebViewPlugin.init();

        var initLeftMenuPromise = Promise.join(
            DrawerPlugin.init(),
            webViewPromise,
            initLeftMenu);

        var initNavigationItemsPromise = Promise.join(
            initLeftMenuPromise,
            constructTabItemsPromise,
            counterBadgeControllerPromise,
            cartEventHandler,
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

define([
    'astro-full',
    'astro-rpc',
    'plugins/drawerPlugin',
    'plugins/webViewPlugin',
    'config/menuConfig',
    'scaffold-controllers/navigationController',
    'bluebird'
],
function(
    Astro,
    AstroRpc,
    DrawerPlugin,
    WebViewPlugin,
    MenuConfig,
    NavigationController,
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
        drawer.setLeftMenu(leftMenu);

        return drawer;
    };

    var initNavigationItems = function(drawer, tabItems, counterBadgeController, cartEventHandler, errorController) {
        var drawerEventHandler = function() {
            drawer.showLeftMenu();
        };

        drawer.itemViews = {};
        drawer.itemControllers = {};

        // Make sure all tabViews are set up
        return Promise.all(tabItems.map(function(tab) {
            //Init a new NavigationController
            var navigationControllerPromise = NavigationController.init(
                tab,
                counterBadgeController,
                cartEventHandler,
                drawerEventHandler,
                errorController
            );

            return navigationControllerPromise.then(function(navigationController) {
                    drawer.itemControllers[tab.id] = navigationController;
                    drawer.itemViews[tab.id] = navigationController.viewPlugin;

                    return drawer;
                });

            })).then(function() {
                return drawer;
            });
        };

    DrawerController.init = function(counterBadgeControllerPromise, cartEventHandlerPromise, errorControllerPromise) {
        var constructTabItemsPromise = Promise.resolve(MenuConfig.menuItems);
        var webViewPromise = WebViewPlugin.init();

        Astro.registerRpcMethod(AstroRpc.names.menuItems, [], function(res) {
            res.send(null, MenuConfig.menuItems);
        });

        var initLeftMenuPromise = Promise.join(
            DrawerPlugin.init(),
            webViewPromise,
            initLeftMenu);

        var initNavigationItemsPromise = Promise.join(
            initLeftMenuPromise,
            constructTabItemsPromise,
            counterBadgeControllerPromise,
            cartEventHandlerPromise,
            errorControllerPromise,
            initNavigationItems);

        return Promise.all([initNavigationItemsPromise]).then(function() {
            return Promise.join(initNavigationItemsPromise, webViewPromise, function(drawer, leftMenu) {
                return new DrawerController(drawer, leftMenu);
            });
        });
    };

    DrawerController.prototype.selectItem = function(itemId) {
        if (this.activeItemId !== itemId) {
            if (this.activeItemId) {
                this.drawer.itemControllers[this.activeItemId].isActive = false;
            }
            this.drawer.setContentView(this.drawer.itemViews[itemId]);
            var selectedItem = this.drawer.itemControllers[itemId];
            selectedItem.isActive = true;
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

    DrawerController.prototype.canGoBack = function() {
        var activeItem = this.drawer.itemControllers[this.activeItemId];
        return activeItem.canGoBack();
    };
    return DrawerController;
});

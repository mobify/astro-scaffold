define([
    'astro-full',
    'app-rpc',
    'plugins/drawerPlugin',
    'plugins/webViewPlugin',
    'config/baseConfig',
    'config/menuConfig',
    'scaffold-controllers/navigationController',
    'bluebird'
],
function(
    Astro,
    AppRpc,
    DrawerPlugin,
    WebViewPlugin,
    BaseConfig,
    MenuConfig,
    NavigationController,
    Promise
) {

    var DrawerController = function(drawer, leftMenu, navigationController) {
        this.drawer = drawer;
        this.leftMenu = leftMenu;
        this.navigationController = navigationController;
    };

    var initLeftMenu = function(drawer, leftMenu) {
        Astro.registerRpcMethod(AppRpc.names.menuItems, [], function(res) {
            res.send(null, MenuConfig.menuItems);
        });

        leftMenu.navigate('file:///scaffold-www/html/left-drawer.html');
        leftMenu.disableScrolling();
        drawer.setLeftMenu(leftMenu);

        return drawer;
    };

    var initNavigationItems = function(drawer, counterBadgeController, cartEventHandler, errorController) {
        var drawerEventHandler = function() {
            drawer.showLeftMenu();
        };

        // The navigationController requires an id. Since we are using a drawer
        // layout, we have 1 main navigation plugin -- thus its ID is set to 1.
        var controllerID = 1;
        return NavigationController.init(
            controllerID,
            BaseConfig.baseURL,
            counterBadgeController,
            cartEventHandler,
            errorController,
            drawerEventHandler);
    };

    DrawerController.init = function(counterBadgeControllerPromise, cartEventHandlerPromise, errorControllerPromise) {
        var webViewPromise = WebViewPlugin.init();

        var initLeftMenuPromise = Promise.join(
            DrawerPlugin.init(),
            webViewPromise,
            initLeftMenu);

        var initNavigationItemsPromise = Promise.join(
            initLeftMenuPromise,
            counterBadgeControllerPromise,
            cartEventHandlerPromise,
            errorControllerPromise,
            initNavigationItems);

        return Promise.join(
            initLeftMenuPromise,
            initNavigationItemsPromise,
            webViewPromise,
        function(drawer, navigationController, leftMenu) {
            navigationController.setActive(true);
            leftMenu.disableDefaultNavigationHandler();
            drawer.setContentView(navigationController.viewPlugin);
            return new DrawerController(drawer, leftMenu, navigationController);
        });
    };

    DrawerController.prototype.navigateToNewRootView = function(url, title) {
        // Strip away 'file://' from relative urls coming from anchor tags
        if (url.indexOf('file://') > -1) {
            url = url.replace('file://', BaseConfig.baseURL);
        }
        this.navigationController.navigateMainViewToNewRoot(url, title);
        this.drawer.hideLeftMenu();
    };

    DrawerController.prototype.backActiveItem = function() {
        var activeItem = this.navigationController;
        activeItem.back();
    };

    DrawerController.prototype.canGoBack = function() {
        var activeItem = this.drawer.navigationController;
        return activeItem.canGoBack();
    };

    // This method is used to re-render the left menu after it has already
    // been initialized.
    DrawerController.prototype.renderLeftMenu = function(menuItems) {
        this.leftMenu.trigger('setMenuItems', {'menuItems': menuItems});
    };

    return DrawerController;
});

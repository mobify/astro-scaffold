define([
    'astro-full',
    'astro-rpc',
    'plugins/drawerPlugin',
    'plugins/webViewPlugin',
    'config/menuConfig',
    'config/baseConfig',
    'scaffold-controllers/navigationController',
    'bluebird'
],
function(
    Astro,
    AstroRpc,
    DrawerPlugin,
    WebViewPlugin,
    MenuConfig,
    BaseConfig,
    NavigationController,
    Promise
) {

    var DrawerController = function(drawer, leftMenu) {
        this.drawer = drawer;
        this.leftMenu = leftMenu;
        // TODO: tony fix this
        // this.activeItemId = null;
    };

    var initLeftMenu = function(drawer, leftMenu) {
        leftMenu.navigate('file:///scaffold-www/html/left-drawer.html');
        leftMenu.disableScrolling();
        drawer.setLeftMenu(leftMenu);
        return drawer;
    };

    var initNavigationItems = function(drawer, counterBadgeController, cartEventHandler, errorController) {
        var drawerEventHandler = function() {
            drawer.showLeftMenu();
        };

        //TODO: tony fix this
        // Make sure all tabViews are set up
        var tab = null;
        return NavigationController.init(
                tab,
                counterBadgeController,
                cartEventHandler,
                errorController,
                drawerEventHandler,
                BaseConfig.baseURL
            )
            .then(function(navigationController) {
                drawer.navigationController= navigationController;
                return drawer;
            });
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

        return Promise.join(initNavigationItemsPromise, webViewPromise, function(drawer, leftMenu) {
            leftMenu.disableDefaultNavigationHandler();
            drawer.setContentView(drawer.navigationController.viewPlugin);
            return new DrawerController(drawer, leftMenu);
        });
    };

    DrawerController.prototype.navigateToNewRootView = function(url, title) {
        // Strip away 'file://' from relative urls coming from anchor tags
        if (url.indexOf('file://') > -1) {
            url = url.replace('file://', BaseConfig.baseURL);
        }
        this.drawer.navigationController.navigateMainViewToNewRoot(url, title);
        this.drawer.hideLeftMenu();
    };

    DrawerController.prototype.canGoBack = function() {
        var activeItem = this.drawer.navigationController;
        return activeItem.canGoBack();
    };
    return DrawerController;
});

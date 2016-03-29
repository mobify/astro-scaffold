define([
    'astro-full',
    'app-rpc',
    'plugins/drawerPlugin',
    'plugins/webViewPlugin',
    'config/baseConfig',
    'scaffold-controllers/navigationController',
    'bluebird'
],
function(
    Astro,
    AppRpc,
    DrawerPlugin,
    WebViewPlugin,
    BaseConfig,
    NavigationController,
    Promise
) {

    var DrawerController = function(drawer, leftMenu) {
        this.drawer = drawer;
        this.leftMenu = leftMenu;
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

        // The navigationController requires an id. Since we are using a drawer
        // layout, we have 1 main navigation plugin -- thus its ID is set to 1.
        var controllerID = 1;
        return NavigationController.init(
                controllerID,
                BaseConfig.baseURL,
                counterBadgeController,
                cartEventHandler,
                errorController,
                drawerEventHandler
            )
            .then(function(navigationController) {
                drawer.navigationController= navigationController;
                navigationController.isActive = true;
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

    DrawerController.prototype.backActiveItem = function() {
        var activeItem = this.drawer.navigationController;
        activeItem.back();
    };

    DrawerController.prototype.canGoBack = function() {
        var activeItem = this.drawer.navigationController;
        return activeItem.canGoBack();
    };

    return DrawerController;
});

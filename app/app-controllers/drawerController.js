import Promise from 'bluebird';
import Astro from 'astro/astro-full';
import DrawerPlugin from 'astro/plugins/drawerPlugin';
import WebViewPlugin from 'astro/plugins/webViewPlugin';
import BaseConfig from '../app-config/baseConfig';
import DrawerMenuConfig from '../app-config/drawerMenuConfig';
import AppRpc from '../global/app-rpc';
import NavigationController from './navigationController';

const DrawerController = function(drawer, leftMenu, navigationController) {
    this.drawer = drawer;
    this.leftMenu = leftMenu;
    this.navigationController = navigationController;
};

const initLeftMenu = function(drawer, leftMenu) {
    Astro.registerRpcMethod(AppRpc.names.menuItems, [], (res) => {
        res.send(null, DrawerMenuConfig.menuItems);
    });

    leftMenu.navigate('file:///app-www/html/left-drawer.html');
    leftMenu.disableScrolling();
    drawer.setLeftMenu(leftMenu);

    return drawer;
};

const initNavigationController = function(drawer, counterBadgeController, cartEventHandler, errorController) {
    const drawerEventHandler = function() {
        drawer.showLeftMenu();
    };

    // The navigationController requires an id. Since we are using a drawer
    // layout, we have 1 main navigation plugin -- thus its ID is set to 1.
    const controllerID = 1;
    return NavigationController.init(
        controllerID,
        BaseConfig.baseURL,
        counterBadgeController,
        cartEventHandler,
        errorController,
        drawerEventHandler);
};

DrawerController.init = function(counterBadgeControllerPromise, cartEventHandlerPromise, errorControllerPromise) {
    const webViewPromise = WebViewPlugin.init();

    const initLeftMenuPromise = Promise.join(
        DrawerPlugin.init(),
        webViewPromise,
        initLeftMenu);

    const initNavigationControllerPromise = Promise.join(
        initLeftMenuPromise,
        counterBadgeControllerPromise,
        cartEventHandlerPromise,
        errorControllerPromise,
        initNavigationController);

    return Promise.join(
        initLeftMenuPromise,
        initNavigationControllerPromise,
        webViewPromise,
    (drawer, navigationController, leftMenu) => {
        navigationController.isActive = true;
        leftMenu.disableDefaultNavigationHandler();
        drawer.setContentView(navigationController.viewPlugin);
        const drawerController = new DrawerController(drawer, leftMenu, navigationController);

        Astro.registerRpcMethod(AppRpc.names.renderLeftMenu, ['menuItems'], (res, menuItems) => {
            drawerController.renderLeftMenu(menuItems);
        });

        return drawerController;
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
    const activeItem = this.navigationController;
    activeItem.back();
};

DrawerController.prototype.canGoBack = function() {
    const activeItem = this.navigationController;
    return activeItem.canGoBack();
};

// This method is used to re-render the left menu after it has already
// been initialized.
DrawerController.prototype.renderLeftMenu = function(menuItems) {
    this.leftMenu.trigger('setMenuItems', {menuItems});
};

export default DrawerController;

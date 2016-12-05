import Astro from 'astro/astro-full';

var AppRpc = {};

AppRpc.names = {
    cartShow: 'cartShow',
    cartHide: 'cartHide',
    menuItems: 'menuItems',
    renderLeftMenu: 'renderLeftMenu',
    welcomeShow: 'welcomeShow',
    welcomeHide: 'welcomeHide',
    welcomeHasHeader: 'welcomeHasHeader',
    navigateToNewRootView: 'navigateToNewRootView'
};

AppRpc.cartShow = Astro.jsRpcMethod(AppRpc.names.cartShow, []);
AppRpc.cartHide = Astro.jsRpcMethod(AppRpc.names.cartHide, []);
AppRpc.menuItems = Astro.jsRpcMethod(AppRpc.names.menuItems, []);
AppRpc.renderLeftMenu = Astro.jsRpcMethod(AppRpc.names.renderLeftMenu, ['menuItems']);
AppRpc.welcomeShow = Astro.jsRpcMethod(AppRpc.names.welcomeShow, []);
AppRpc.welcomeHide = Astro.jsRpcMethod(AppRpc.names.welcomeHide, []);
AppRpc.welcomeHasHeader = Astro.jsRpcMethod(AppRpc.names.welcomeHasHeader, []);
AppRpc.navigateToNewRootView = Astro.jsRpcMethod(AppRpc.names.navigateToNewRootView, ['url', 'title']);

module.exports = AppRpc;

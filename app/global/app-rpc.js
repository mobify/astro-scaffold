define([
    'astro-full'
],
function(
    Astro
) {
    var AppRpc = {};

    AppRpc.names = {
        appCanGoBack: 'appCanGoBack',
        cartShow: 'cartShow',
        cartHide: 'cartHide',
        errorContent: 'errorContent',
        menuItems: 'menuItems',
        renderLeftMenu: 'renderLeftMenu',
        searchHide: 'searchHide',
        searchIsShowing: 'searchIsShowing',
        welcomeShow: 'welcomeShow',
        welcomeHide: 'welcomeHide',
        welcomeHasHeader: 'welcomeHasHeader',
        navigateToNewRootView: 'navigateToNewRootView'
    };

    AppRpc.appCanGoBack = Astro.jsRpcMethod(AppRpc.names.appCanGoBack, []);
    AppRpc.cartShow = Astro.jsRpcMethod(AppRpc.names.cartShow, []);
    AppRpc.cartHide = Astro.jsRpcMethod(AppRpc.names.cartHide, []);
    AppRpc.errorContent = Astro.jsRpcMethod(AppRpc.names.errorContent, []);
    AppRpc.menuItems = Astro.jsRpcMethod(AppRpc.names.menuItems, []);
    AppRpc.renderLeftMenu = Astro.jsRpcMethod(AppRpc.names.renderLeftMenu, ['menuItems']);
    AppRpc.welcomeShow = Astro.jsRpcMethod(AppRpc.names.welcomeShow, []);
    AppRpc.welcomeHide = Astro.jsRpcMethod(AppRpc.names.welcomeHide, []);
    AppRpc.welcomeHasHeader = Astro.jsRpcMethod(AppRpc.names.welcomeHasHeader, []);
    AppRpc.navigateToNewRootView = Astro.jsRpcMethod(AppRpc.names.navigateToNewRootView, ['url', 'title']);
    AppRpc.searchHide = Astro.jsRpcMethod(AppRpc.names.searchHide, ['params']);
    AppRpc.searchIsShowing = Astro.jsRpcMethod(AppRpc.names.searchIsShowing, []);

    return AppRpc;
});

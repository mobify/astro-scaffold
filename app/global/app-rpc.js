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
        welcomeShow: 'welcomeShow',
        welcomeHide: 'welcomeHide',
        welcomeHasHeader: 'welcomeHasHeader',
        navigateToNewRootView: 'navigateToNewRootView'
    };

    AppRpc.appCanGoBack = Astro.jsRpcMethod(AppRpc.names.appCanGoBack, []);
    AppRpc.cartShow = Astro.jsRpcMethod(AppRpc.names.cartShow, []);
    AppRpc.cartHide = Astro.jsRpcMethod(AppRpc.names.cartHide, []);
    AppRpc.errorContent = Astro.jsRpcMethod(AppRpc.names.errorContent, []);
    AppRpc.welcomeShow = Astro.jsRpcMethod(AppRpc.names.welcomeShow, []);
    AppRpc.welcomeHide = Astro.jsRpcMethod(AppRpc.names.welcomeHide, []);
    AppRpc.welcomeHasHeader = Astro.jsRpcMethod(AppRpc.names.welcomeHasHeader, []);
    AppRpc.navigateToNewRootView = Astro.jsRpcMethod(AppRpc.names.navigateToNewRootView, ['url', 'title']);

    return AppRpc;
});

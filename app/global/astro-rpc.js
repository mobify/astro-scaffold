define([
    'astro-full'
],
function(
    Astro
) {
    var AstroRpc = {};

    AstroRpc.names = {
        appCanGoBack: 'appCanGoBack',
        cartShow: 'cartShow',
        cartHide: 'cartHide',
        errorContent: 'errorContent',
        welcomeShow: 'welcomeShow',
        welcomeHide: 'welcomeHide',
        welcomeHasHeader: 'welcomeHasHeader',
        navigateToNewRootView: 'navigateToNewRootView'
    };
    AstroRpc.appCanGoBack = Astro.jsRpcMethod(AstroRpc.names.appCanGoBack, []);
    AstroRpc.cartShow = Astro.jsRpcMethod(AstroRpc.names.cartShow, []);
    AstroRpc.cartHide = Astro.jsRpcMethod(AstroRpc.names.cartHide, []);
    AstroRpc.errorContent = Astro.jsRpcMethod(AstroRpc.names.errorContent, []);
    AstroRpc.welcomeShow = Astro.jsRpcMethod(AstroRpc.names.welcomeShow, []);
    AstroRpc.welcomeHide = Astro.jsRpcMethod(AstroRpc.names.welcomeHide, []);
    AstroRpc.welcomeHasHeader = Astro.jsRpcMethod(AstroRpc.names.welcomeHasHeader, []);
    AstroRpc.navigateToNewRootView = Astro.jsRpcMethod(AstroRpc.names.navigateToNewRootView, ['url', 'title']);

    return AstroRpc;
});

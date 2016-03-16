define([
    'astro-full'
],
function(
    Astro
) {
    var AstroRpc = {};

    AstroRpc.names = {
        openCart: 'openCart',
        closeCart: 'closeCart',
        menuItems: 'menuItems',
        showWelcome: 'showWelcome',
        hideWelcome: 'hideWelcome',
        welcomeHasHeader: 'welcomeHasHeader'
    };

    AstroRpc.openCart = Astro.jsRpcMethod(AstroRpc.names.openCart, []);
    AstroRpc.closeCart = Astro.jsRpcMethod(AstroRpc.names.closeCart, []);
    AstroRpc.menuItems = Astro.jsRpcMethod(AstroRpc.names.menuItems, []);
    AstroRpc.showWelcome = Astro.jsRpcMethod(AstroRpc.names.showWelcome, []);
    AstroRpc.hideWelcome = Astro.jsRpcMethod(AstroRpc.names.hideWelcome, []);
    AstroRpc.welcomeHasHeader = Astro.jsRpcMethod(AstroRpc.names.welcomeHasHeader, []);

    return AstroRpc;
});

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
        menuItems: 'menuItems'
    };

    AstroRpc.openCart = Astro.jsRpcMethod(AstroRpc.names.openCart, []);
    AstroRpc.closeCart = Astro.jsRpcMethod(AstroRpc.names.closeCart, []);
    AstroRpc.menuItems = Astro.jsRpcMethod(AstroRpc.names.menuItems, []);

    return AstroRpc;
});

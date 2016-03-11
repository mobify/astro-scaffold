define([
    'astro-full'
],
function(
    Astro
) {
    var AstroRpc = {};

    AstroRpc.names = {
        openCart: 'openCart',
        closeCart: 'closeCart'
    };

    AstroRpc.openCart = Astro.jsRpcMethod(AstroRpc.names.openCart, []);
    AstroRpc.closeCart = Astro.jsRpcMethod(AstroRpc.names.closeCart, []);

    return AstroRpc;
});

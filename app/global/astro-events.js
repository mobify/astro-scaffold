define([
    'astro-full'
],
function(
    Astro
) {
    var AstroEvents = {};

    AstroEvents.rpcNames = {
        openCart: 'openCart',
        closeCart: 'closeCart',
        cartShowing: 'cartShowing'
    };

    AstroEvents.openCart = Astro.jsRpcMethod(AstroEvents.rpcNames.openCart, []);
    AstroEvents.closeCart = Astro.jsRpcMethod(AstroEvents.rpcNames.closeCart, []);
    AstroEvents.cartShowing = Astro.jsRpcMethod(AstroEvents.rpcNames.cartShowing, []);

    return AstroEvents;
});

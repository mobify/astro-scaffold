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
        showWelcome: 'showWelcome',
        hideWelcome: 'hideWelcome'
    };

    AstroRpc.openCart = Astro.jsRpcMethod(AstroRpc.names.openCart, []);
    AstroRpc.closeCart = Astro.jsRpcMethod(AstroRpc.names.closeCart, []);
    AstroRpc.showWelcome = Astro.jsRpcMethod(AstroRpc.names.showWelcome, []);
    AstroRpc.hideWelcome = Astro.jsRpcMethod(AstroRpc.names.hideWelcome, []);

    return AstroRpc;
});

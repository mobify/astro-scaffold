define([
    'astro-full',
    'astro-rpc',
    'bluebird',
    'plugins/modalViewPlugin',
    'scaffold-controllers/cart/cartController'
],
/* eslint-disable */
function(
    Astro,
    AstroRpc,
    Promise,
    ModalViewPlugin,
    CartController
) {
/* eslint-enable */

    var CartModalController = function(modalView, cartController) {
        this.isShowing = false;
        this.viewPlugin = modalView;
        this.cartController = cartController;

        // Privileged methods
        this._reload = function() {
            cartController.reload();
        };

        this._loadBlank = function() {
            cartController.navigate('about:blank');
        };
    };

    CartModalController.init = function() {
        return Promise.join(
            CartController.init(),
            ModalViewPlugin.init(),
        function(cartController, modalView) {
            modalView.setContentView(cartController.viewPlugin);

            var cartModalController = new CartModalController(modalView, cartController);
            cartController.registerCloseEventHandler(function() {
                cartModalController.hide();
            });

            // Register RPC methods
            Astro.registerRpcMethod(AstroRpc.names.openCart, [], function(res) {
                cartModalController.show();
            });
            Astro.registerRpcMethod(AstroRpc.names.closeCart, [], function(res) {
                cartModalController.hide();
            });

            return cartModalController;
        });
    };

    CartModalController.prototype.show = function() {
        if (this.isShowing) {
            return;
        }
        // As per request, we reload cart on `show` every time
        this.isShowing = true;
        this._reload();
        this.viewPlugin.show({animated: true});
    };

    CartModalController.prototype.hide = function() {
        // We load a blank page upon hide to prevent displaying
        // previously loaded content when we open the cart
        this.viewPlugin.hide({animated: true});
        this.isShowing = false;
        this._loadBlank();
    };

    CartModalController.prototype.back = function() {
        return this.cartController.back();
    };

    return CartModalController;
});

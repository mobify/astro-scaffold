define([
    'astro-full',
    'astro-events',
    'bluebird',
    'plugins/modalViewPlugin',
    'scaffold-controllers/cartController'
],
/* eslint-disable */
function(
    Astro,
    AstroEvents,
    Promise,
    ModalViewPlugin,
    CartController
) {
/* eslint-enable */

    var CartModalController = function(modalView, cartController) {
        this.isShowing = false;
        this.viewPlugin = modalView;


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
            Astro.registerRpcMethod(AstroEvents.rpcNames.openCart, [], function(res) {
                cartModalController.show();
            });
            Astro.registerRpcMethod(AstroEvents.rpcNames.closeCart, [], function(res) {
                cartModalController.hide();
            });
            Astro.registerRpcMethod(AstroEvents.rpcNames.cartShowing, [], function(res) {
                res.send(null, cartModalController.isActiveItem());
            });
            return cartModalController;
        });
    };

    CartModalController.prototype.show = function() {
        if (this.isShowing) {
            return;
        }
        this._reload();
        this.isShowing = true;
        this.viewPlugin.show({animated: true});
    };

    CartModalController.prototype.hide = function() {
        this.viewPlugin.hide({animated: true});
        this.isShowing = false;
        this._loadBlank();
    };

    CartModalController.prototype.isActiveItem = function() {
        return this.isShowing;
    };
    return CartModalController;
});

define([
    'bluebird',
    'plugins/modalViewPlugin',
    'scaffold-controllers/cartController'
],
/* eslint-disable */
function(
    Promise,
    ModalViewPlugin,
    CartController
) {
/* eslint-enable */

    var CartModalController = function(modalView, cartController) {
        this.modalView = modalView;
        this.cartController = cartController;
    };

    CartModalController.init = function() {
        return Promise.join(
            ModalViewPlugin.init(),
            CartController.init(),
        function(modalView, cartController) {
            modalView.setContentView(cartController.webView);
            return new CartModalController(modalView, cartController);
        });
    };

    CartModalController.prototype.show = function() {
        this.modalView.show();
    };

    return CartModalController;
});

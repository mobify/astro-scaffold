define([
    'bluebird',
    'plugins/modalViewPlugin',
    'plugins/anchoredLayoutPlugin',
    'scaffold-controllers/cartController',
    'scaffold-controllers/cartHeaderController'
],
/* eslint-disable */
function(
    Promise,
    ModalViewPlugin,
    AnchoredLayoutPlugin,
    CartController,
    CartHeaderController
) {
/* eslint-enable */

    var CartModalController = function(modalView) {
        this.modalView = modalView;
    };

    CartModalController.init = function() {
        return Promise.join(
            ModalViewPlugin.init(),
            AnchoredLayoutPlugin.init(),
            CartController.init(),
            CartHeaderController.init(),
        function(modalView, anchoredLayout, cartController, cartHeaderController) {
            cartHeaderController.registerCloseEvents(function() {
                modalView.hide();
            });

            anchoredLayout.addTopView(cartHeaderController.headerBar);
            anchoredLayout.setContentView(cartController.webView);
            modalView.setContentView(anchoredLayout);
            return new CartModalController(modalView);
        });
    };

    CartModalController.prototype.show = function() {
        this.modalView.show();
    };

    return CartModalController;
});

import Promise from 'bluebird';
import Astro from 'astro/astro-full';
import ModalViewPlugin from 'astro/plugins/modalViewPlugin';
import AppEvents from '../../global/app-events';
import AppRpc from '../../global/app-rpc';
import CartController from './cartController';

const CartModalController = function(modalView, cartController) {
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

CartModalController.init = function(errorControllerPromise) {
    return Promise.join(
        CartController.init(),
        ModalViewPlugin.init(),
        errorControllerPromise,
    (cartController, modalView, errorController) => {
        modalView.setContentView(cartController.viewPlugin);

        const cartModalController = new CartModalController(modalView, cartController);
        cartController.registerCloseEventHandler(() => {
            cartModalController.hide();
        });

        // Register RPC methods
        Astro.registerRpcMethod(AppRpc.names.cartShow, [], () => {
            cartModalController.show();
        });
        Astro.registerRpcMethod(AppRpc.names.cartHide, [], () => {
            cartModalController.hide();
        });

        const backHandler = function() {
            cartModalController.hide();
        };

        const retryHandler = function(params) {
            if (!params.url) {
                return;
            }
            cartController.navigate(params.url);
        };

        // Modals will always be able to go back. At it's root, the modal
        // will dismiss.
        const canGoBack = function() {
            return Promise.resolve(true);
        };

        errorController.bindToNavigator({
            navigator: cartController.webView,
            backHandler,
            retryHandler,
            isActiveItem: cartModalController.isActiveItem.bind(cartModalController),
            canGoBack
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
    AppEvents.trigger(AppEvents.names.cartShown);
};

CartModalController.prototype.hide = function() {
    // We load a blank page upon hide to prevent displaying
    // previously loaded content when we open the cart
    AppEvents.trigger(AppEvents.names.cartHidden);
    this.viewPlugin.hide({animated: true});
    this.isShowing = false;
    this._loadBlank();
};

CartModalController.prototype.back = function() {
    return this.cartController.back();
};

CartModalController.prototype.isActiveItem = function() {
    return this.isShowing;
};

export default CartModalController;

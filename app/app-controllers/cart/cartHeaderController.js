import HeaderBarPlugin from 'astro/plugins/headerBarPlugin';
import CartConfig from '../../app-config/cartConfig';

const CartHeaderController = function(headerBar) {
    this.viewPlugin = headerBar;
};

CartHeaderController.init = function() {
    return HeaderBarPlugin.init().then((headerBar) => {
        headerBar.setTextColor(CartConfig.colors.textColor);
        headerBar.setBackgroundColor(CartConfig.colors.backgroundColor);

        headerBar.setCenterTitle(
            CartConfig.headerContent.title,
            CartConfig.headerContent.id
        );

        headerBar.setRightIcon(
            CartConfig.closeIcon.imageUrl,
            CartConfig.closeIcon.id
        );

        return new CartHeaderController(headerBar);
    });
};

CartHeaderController.prototype.registerCloseEventHandler = function(callback) {
    if (!callback) {
        return;
    }

    this.viewPlugin.on(`click:${CartConfig.closeIcon.id}`, callback);
};

export default CartHeaderController;

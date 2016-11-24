import Promise from 'bluebird';
import HeaderBarPlugin from 'astro/plugins/headerBarPlugin';
import CartConfig from '../../app-config/cartConfig';

var CartHeaderController = function(headerBar) {
    this.viewPlugin = headerBar;
};

CartHeaderController.init = function() {
    return HeaderBarPlugin.init().then(function(headerBar) {
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

    this.viewPlugin.on('click:' + CartConfig.closeIcon.id, callback);
};

module.exports = CartHeaderController;

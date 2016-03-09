define([
    'bluebird',
    'config/cartConfig',
    'plugins/headerBarPlugin'
],
/* eslint-disable */
function(
    Promise,
    CartConfig,
    HeaderBarPlugin
) {
/* eslint-enable */

    var CartHeaderController = function(headerBar) {
        this.viewPlugin = headerBar;
    };

    CartHeaderController.init = function() {
        return HeaderBarPlugin.init().then(function(headerBar) {
            headerBar.setTextColor(CartConfig.colors.titleTextColor);
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

    return CartHeaderController;
});

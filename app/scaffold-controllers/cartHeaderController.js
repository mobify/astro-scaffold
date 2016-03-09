define([
    'bluebird',
    'config/baseConfig',
    'config/headerConfig',
    'plugins/headerBarPlugin'
],
/* eslint-disable */
function(
    Promise,
    BaseConfig,
    HeaderConfig,
    HeaderBarPlugin
) {
/* eslint-enable */

    var CartHeaderController = function(headerBar) {
        this.headerBar = headerBar;
    };

    CartHeaderController.init = function() {
        return HeaderBarPlugin.init().then(function(headerBar) {
            headerBar.setTextColor(BaseConfig.colors.whiteColor);
            headerBar.setBackgroundColor(BaseConfig.colors.primaryColor);

            headerBar.setCenterTitle(
                HeaderConfig.cartTitleHeaderContent.title,
                HeaderConfig.cartTitleHeaderContent.id
            );

            headerBar.setRightIcon(
                HeaderConfig.closeHeaderContent.imageUrl,
                HeaderConfig.closeHeaderContent.id
            );

            var cartHeaderController = new CartHeaderController(headerBar);

            return cartHeaderController;
        });
    };

    CartHeaderController.prototype.registerCloseEvents = function(callback) {
        if (!callback) {
            return;
        }

        this.headerBar.on('click:' + HeaderConfig.closeHeaderContent.id, callback);
    };

    return CartHeaderController;
});

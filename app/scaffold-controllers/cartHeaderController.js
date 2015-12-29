define([
    'plugins/headerBarPlugin',
    'scaffold-components/headerConfig',
    'bluebird'
],
/* eslint-disable */
function(
    HeaderBarPlugin,
    HeaderConfig,
    Promise
) {
/* eslint-enable */

    var CartHeaderController = function(headerBar) {
        this.headerBar = headerBar;
    };

    CartHeaderController.init = function() {
        return HeaderBarPlugin.init().then(function(headerBar) {
            headerBar.setTextColor(HeaderConfig.colors.textColor);
            headerBar.setBackgroundColor(HeaderConfig.colors.backgroundColor);

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

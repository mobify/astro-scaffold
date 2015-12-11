define([
    'plugins/headerBarPlugin',
    'bluebird'
],
function(
    HeaderBarPlugin,
    Promise
) {

    var TabHeaderController = function(headerBar) {
        this.viewPlugin = headerBar;
    };

    var _createCartHeaderContent = function() {
        return {
            id: 'cart_id',
            imageUrl: 'file:///Icon__cart.png'
        };
    };

    TabHeaderController.init = function() {
        return HeaderBarPlugin.init().then(function(headerBar) {
            headerBar.hideBackButtonText();
            headerBar.setTextColor('#ffffff');
            headerBar.setBackgroundColor('#007BA7');

            var tabHeaderController = new TabHeaderController(headerBar);

            return tabHeaderController;
        });
    };

    TabHeaderController.prototype.generateContent = function() {
        var headerContent = {
            header: {
                rightIcon: _createCartHeaderContent()
            }
        };

        return Promise.resolve(headerContent);
    };

    TabHeaderController.prototype.registerBackEvents = function(callback) {
        if (!callback) {
            return;
        }

        this.viewPlugin.on('click:back', callback);
    };

    TabHeaderController.prototype.setTitle = function() {
        this.viewPlugin.setCenterTitle('Velo', 'header_id');
    };

    return TabHeaderController;
});

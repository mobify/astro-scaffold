define([
    'scaffold-plugins/counterBadgePlugin',
    'plugins/headerBarPlugin',
    'bluebird'
],
function(
    CounterBadgePlugin,
    HeaderBarPlugin,
    Promise
) {

    var TabHeaderController = function(headerBar) {
        this.viewPlugin = headerBar;
    };

    var _setCartCounter = function(counterBadge, count) {
        counterBadge.setCount(count ? count : 0);
    };

    var _createCartCounter = function(counterBadge) {
        if (counterBadge) {
            // Set Icon
            counterBadge.setImagePath('file:///Icon__cart.png');
            counterBadge.setBackgroundColor('#ff0000');

            // Set Counter Badge initial value
            _setCartCounter(counterBadge, 1);

            // In order to update the counter badge on every tab
            // and on every stack item this code should register to
            // listen for a cart update counter event
            // (which app will have to emit)
            // Call _setCartCounter from here every time tht event is received

            // Example:
            // ScaffoldApplication.on(ScaffoldApplication.events.cartUpdateCounter, function(param) {
            //     _setCartCounter(counterBadge, param.count);
            // });
        }
    };

    var _createCartHeaderContent = function(counterBadge) {
        return {
            id: 'cart_id',
            pluginAddress: counterBadge.toMethodArg()
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
        return CounterBadgePlugin.init().then(
            function(counterBadge) {
                _createCartCounter(counterBadge);

                return {
                    header: {
                        rightIcon: _createCartHeaderContent(counterBadge)
                    }
                };
            }
        );
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

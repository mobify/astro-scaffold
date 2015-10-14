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

    // // var _setCartCounter = function(counterBadge, count) {
    // //     counterBadge.setCount(count ? count : 0);
    // // };
    //
    var _createCartCounter = function(counterBadge) {
        if (counterBadge) {
            // Set Icon
            counterBadge.setImagePath('file:///Icon__cart.png');
            counterBadge.setBackgroundColor('#ff0000');
            counterBadge.setCount(1);

            // // Set Counter Badge
            // _setCartCounter(counterBadge, ThinkGeekApplication.cartCounter);
            //
            // // Delegate counter update event listener
            // ThinkGeekApplication.on(ThinkGeekApplication.events.cartUpdateCounter, function(param) {
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
            //Application.setStatusBarLightText();
            //headerBar.setOpaque();
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
        this.viewPlugin.setCenterTitle('Scaffold App', 'header_id');
    };

    return TabHeaderController;
});

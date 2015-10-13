define([
    // 'thinkgeek-components/headerBar',
    // 'thinkgeek-components/cartConfig',
    // 'thinkgeek-components/headerConfig',
    // 'thinkgeek-plugins/counterBadgePlugin',
    'plugins/headerBarPlugin',
    'bluebird'
],
function(
    HeaderBarPlugin,
    Promise
) {
// function(
//     HeaderBar,
//     CartConfig,
//     HeaderConfig,
//     CounterBadgePlugin,
//     Promise
// ) {
    // Global cart counter to share btw. all the instances

    var TabHeaderController = function(headerBar) {
        this.viewPlugin = headerBar;
    };

    // // var _setCartCounter = function(counterBadge, count) {
    // //     counterBadge.setCount(count ? count : 0);
    // // };
    //
    // var _createCartCounter = function(counterBadge) {
    //     if (counterBadge) {
    //         // Set Icon
    //         counterBadge.setImagePath(CartConfig.cartOpenIcon.url);
    //         counterBadge.setBackgroundColor(CartConfig.cartCounterBadge.backgroundColor);
    //
    //         // // Set Counter Badge
    //         // _setCartCounter(counterBadge, ThinkGeekApplication.cartCounter);
    //         //
    //         // // Delegate counter update event listener
    //         // ThinkGeekApplication.on(ThinkGeekApplication.events.cartUpdateCounter, function(param) {
    //         //     _setCartCounter(counterBadge, param.count);
    //         // });
    //     }
    // };
    //
    // var _createCartHeaderContent = function(counterBadge) {
    //     return {
    //         id: 'cart_id',
    //         pluginAddress: counterBadge.toMethodArg()
    //     };
    // };

    TabHeaderController.init = function() {
        return HeaderBarPlugin.init().then(function(headerBar) {
            //Application.setStatusBarLightText();
            //headerBar.setOpaque();
            //headerBar.hideBackButtonText();

            var tabHeaderController = new TabHeaderController(headerBar);

            return tabHeaderController;
        });
    };

    // TabHeaderController.prototype.generateContent = function(includeSearchIcon) {
    //     return CounterBadgePlugin.init().then(
    //         function(counterBadge) {
    //             _createCartCounter(counterBadge);
    //
    //             return {
    //                 header: {
    //                     rightIcon: _createCartHeaderContent(counterBadge)
    //                 }
    //             };
    //         }
    //     );
    // };

    TabHeaderController.prototype.registerBackEvents = function(callback) {
        if (!callback) {
            return;
        }

        this.viewPlugin.on('click:back', callback);
    };

    // TabHeaderController.prototype.setTitle = function(title) {
    //     this.viewPlugin.setCenterTitle(title, HeaderConfig.title.id);
    // };

    return TabHeaderController;
});

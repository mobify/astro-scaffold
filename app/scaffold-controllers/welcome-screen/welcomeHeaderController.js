define([
    'bluebird',
    'plugins/headerBarPlugin',
    'config/welcomeConfig'
],
/* eslint-disable */
function(
    Promise,
    HeaderBarPlugin,
    WelcomeConfig
) {
/* eslint-enable */

    var WelcomeHeaderController = function(headerBar) {
        this.viewPlugin = headerBar;
    };

    WelcomeHeaderController.init = function() {
        return HeaderBarPlugin.init().then(function(headerBar) {
            headerBar.setTextColor(WelcomeConfig.colors.textColor);
            headerBar.setBackgroundColor(WelcomeConfig.colors.backgroundColor);
            headerBar.hideBackButtonText();

            headerBar.setCenterTitle(
                WelcomeConfig.headerContent.title,
                WelcomeConfig.headerContent.id
            );

            headerBar.setRightIcon(
                WelcomeConfig.closeIcon.imageUrl,
                WelcomeConfig.closeIcon.id
            );

            return new WelcomeHeaderController(headerBar);
        });
    };

    WelcomeHeaderController.prototype.generateContent = function() {
        var headerContent = {
            header: {
                rightIcon: WelcomeConfig.closeIcon
            }
        };

        return Promise.resolve(headerContent);
    };

    WelcomeHeaderController.prototype.registerCloseEventHandler = function(callback) {
        if (!callback) {
            return;
        }

        this.viewPlugin.on('click:' + WelcomeConfig.closeIcon.id, callback);
    };

    WelcomeHeaderController.prototype.registerBackEventHandler = function(callback) {
        if (!callback) {
            return;
        }

        this.viewPlugin.on('click:back', callback);
    };

    return WelcomeHeaderController;
});

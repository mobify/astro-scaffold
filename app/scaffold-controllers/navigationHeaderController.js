define([
    'plugins/headerBarPlugin',
    'scaffold-config/headerConfig',
    'bluebird'
],
/* eslint-disable */
function(
    HeaderBarPlugin,
    HeaderConfig,
    Promise
) {
/* eslint-enable */

    var NavigationHeaderController = function(headerBar, counterBadgeController) {
        this.viewPlugin = headerBar;
        this.counterBadgeController = counterBadgeController;
    };

    var _createDrawerHeaderContent = function() {
        return HeaderConfig.drawerHeaderContent;
    };

    NavigationHeaderController.init = function(counterBadgeController) {
        return HeaderBarPlugin.init().then(function(headerBar) {
            headerBar.hideBackButtonText();
            headerBar.setTextColor(HeaderConfig.colors.textColor);
            headerBar.setBackgroundColor(HeaderConfig.colors.backgroundColor);

            var navigationHeaderController =
                new NavigationHeaderController(headerBar, counterBadgeController);

            return navigationHeaderController;
        });
    };

    NavigationHeaderController.prototype.generateContent = function(includeDrawer) {
        return this.counterBadgeController.generateContent().then(function(counterHeaderContent) {
            var headerContent = {
                header: {
                    rightIcon: counterHeaderContent
                }
            };

            if (includeDrawer !== undefined && includeDrawer) {
                headerContent.header.leftIcon = _createDrawerHeaderContent();
            }

            return headerContent;
        });
    };

    NavigationHeaderController.prototype.registerBackEvents = function(callback) {
        if (!callback) {
            return;
        }

        this.viewPlugin.on('click:back', callback);
    };

    NavigationHeaderController.prototype.registerDrawerEvents = function(callback) {
        if (!callback) {
            return;
        }

        this.viewPlugin.on('click:' + HeaderConfig.drawerHeaderContent.id, callback);
    };

    NavigationHeaderController.prototype.registerCartEvents = function(callback) {
        if (!callback) {
            return;
        }

        this.viewPlugin.on('click:' + HeaderConfig.cartHeaderContent.id, callback);
    };

    NavigationHeaderController.prototype.setTitle = function() {
        var titleHeaderContent = HeaderConfig.titleHeaderContent;
        this.viewPlugin.setCenterTitle(titleHeaderContent.title, titleHeaderContent.id);
    };

    return NavigationHeaderController;
});

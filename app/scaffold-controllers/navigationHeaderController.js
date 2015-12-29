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

    var NavigationHeaderController = function(headerBar) {
        this.viewPlugin = headerBar;
    };

    var _createCartHeaderContent = function() {
        return HeaderConfig.cartHeaderContent;
    };

    var _createDrawerHeaderContent = function() {
        return HeaderConfig.drawerHeaderContent;
    };

    NavigationHeaderController.init = function() {
        return HeaderBarPlugin.init().then(function(headerBar) {
            headerBar.hideBackButtonText();
            headerBar.setTextColor(HeaderConfig.colors.textColor);
            headerBar.setBackgroundColor(HeaderConfig.colors.backgroundColor);

            var navigationHeaderController = new NavigationHeaderController(headerBar);

            return navigationHeaderController;
        });
    };

    NavigationHeaderController.prototype.generateContent = function(includeDrawer) {
        var headerContent = {
            header: {
                rightIcon: _createCartHeaderContent()
            }
        };

        if (includeDrawer !== undefined && includeDrawer) {
            headerContent.header.leftIcon = _createDrawerHeaderContent();
        }

        return Promise.resolve(headerContent);
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

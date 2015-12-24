define([
    'plugins/headerBarPlugin',
    'scaffold-components/navigationHeaderConfig',
    'bluebird'
],
function(
    HeaderBarPlugin,
    NavigationHeaderConfig,
    Promise
) {

    var NavigationHeaderController = function(headerBar) {
        this.viewPlugin = headerBar;
    };

    var _createCartHeaderContent = function() {
        return NavigationHeaderConfig.cartHeaderContent;
    };

    var _createDrawerHeaderContent = function() {
        return NavigationHeaderConfig.drawerHeaderContent;
    };

    NavigationHeaderController.init = function() {
        return HeaderBarPlugin.init().then(function(headerBar) {
            headerBar.hideBackButtonText();
            headerBar.setTextColor(NavigationHeaderConfig.colors.textColor);
            headerBar.setBackgroundColor(NavigationHeaderConfig.colors.backgroundColor);

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

        this.viewPlugin.on('click:' + NavigationHeaderConfig.drawerHeaderContent.id, callback);
    };

    NavigationHeaderController.prototype.registerCartEvents = function(callback) {
        if (!callback) {
            return;
        }

        this.viewPlugin.on('click:' + NavigationHeaderConfig.cartHeaderContent.id, callback);
    };

    NavigationHeaderController.prototype.setTitle = function() {
        var titleHeaderContent = NavigationHeaderConfig.titleHeaderContent;
        this.viewPlugin.setCenterTitle(titleHeaderContent.title, titleHeaderContent.id);
    };

    return NavigationHeaderController;
});

define([
    'bluebird',
    'config/headerConfig',
    'plugins/headerBarPlugin',
    'plugins/imageViewPlugin',
    'scaffold-controllers/doubleIconsController'
],
/* eslint-disable */
function(
    Promise,
    HeaderConfig,
    HeaderBarPlugin,
    ImageViewPlugin,
    DoubleIconsController
) {
/* eslint-enable */

    var NavigationHeaderController = function(headerBar, doubleIconsController) {
        this.viewPlugin = headerBar;
        this.doubleIconsController = doubleIconsController;
    };

    var _createDrawerHeaderContent = function() {
        return HeaderConfig.drawerHeaderContent;
    };

    NavigationHeaderController.init = function(counterBadgeController) {
        var generateSearchIcon = function() {
            return ImageViewPlugin.init().then(function(searchIcon) {
                searchIcon.setImagePath(HeaderConfig.searchHeaderContent.imageUrl);
                return searchIcon;
            });
        };

        var generateCartIcon =
            counterBadgeController.generatePlugin.bind(counterBadgeController);

        return Promise.join(
            HeaderBarPlugin.init(),
            DoubleIconsController.init(
                HeaderConfig.searchCartHeaderContent.id,
                generateSearchIcon,
                generateCartIcon),
        function(headerBar, doubleIconsController) {
            headerBar.hideBackButtonText();
            headerBar.setTextColor(HeaderConfig.colors.textColor);
            headerBar.setBackgroundColor(HeaderConfig.colors.backgroundColor);

            return new NavigationHeaderController(headerBar, doubleIconsController);
        });
    };

    NavigationHeaderController.prototype.generateContent = function(includeDrawer) {
        return this.doubleIconsController.generateContent().then(function(doubleIconsHeaderContent) {
            var headerContent = {
                header: {
                    rightIcon: doubleIconsHeaderContent
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

    NavigationHeaderController.prototype.registerSearchBarEvents = function(callback) {
        if (!callback) {
            return;
        }

        this.doubleIconsController.on('click:doubleIcons_left', callback);
    };

    NavigationHeaderController.prototype.registerCartEvents = function(callback) {
        if (!callback) {
            return;
        }

        this.doubleIconsController.on('click:doubleIcons_right', callback);
    };

    NavigationHeaderController.prototype.setTitle = function() {
        var titleHeaderContent = HeaderConfig.titleHeaderContent;
        this.viewPlugin.setCenterTitle(titleHeaderContent.title, titleHeaderContent.id);
    };

    return NavigationHeaderController;
});

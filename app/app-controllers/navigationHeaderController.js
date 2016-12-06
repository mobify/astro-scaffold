import Promise from 'bluebird';
import HeaderBarPlugin from 'astro/plugins/headerBarPlugin';
import ImageViewPlugin from 'astro/plugins/imageViewPlugin';
import HeaderConfig from '../app-config/headerConfig';
import DoubleIconsController from './doubleIconsController';

const NavigationHeaderController = function(headerBar, doubleIconsController) {
    this.viewPlugin = headerBar;
    this.doubleIconsController = doubleIconsController;
};

const _createDrawerHeaderContent = function() {
    return HeaderConfig.drawerHeaderContent;
};

NavigationHeaderController.init = function(counterBadgeController) {
    const generateSearchIcon = function() {
        return ImageViewPlugin.init().then((searchIcon) => {
            searchIcon.setImagePath(HeaderConfig.searchHeaderContent.imageUrl);
            return searchIcon;
        });
    };

    const generateCartIcon =
        counterBadgeController.generatePlugin.bind(counterBadgeController);

    return Promise.join(
        HeaderBarPlugin.init(),
        DoubleIconsController.init(
            HeaderConfig.searchCartHeaderContent.id,
            generateSearchIcon,
            generateCartIcon),
    (headerBar, doubleIconsController) => {
        headerBar.hideBackButtonText();
        headerBar.setTextColor(HeaderConfig.colors.textColor);
        headerBar.setBackgroundColor(HeaderConfig.colors.backgroundColor);

        return new NavigationHeaderController(headerBar, doubleIconsController);
    });
};

NavigationHeaderController.prototype.generateContent = function(includeDrawer) {
    return this.doubleIconsController.generateContent().then((doubleIconsHeaderContent) => {
        const headerContent = {
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

    this.viewPlugin.on(`click:${HeaderConfig.drawerHeaderContent.id}`, callback);
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
    const titleHeaderContent = HeaderConfig.titleHeaderContent;
    return this.viewPlugin.setCenterTitle(titleHeaderContent.title, titleHeaderContent.id);
};

export default NavigationHeaderController;

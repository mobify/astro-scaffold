import Promise from 'bluebird';
import HeaderBarPlugin from 'astro/plugins/headerBarPlugin';
import WelcomeConfig from '../../app-config/welcomeConfig';

var WelcomeHeaderController = function(headerBar) {
    this.viewPlugin = headerBar;
};

WelcomeHeaderController.init = function() {
    return HeaderBarPlugin.init().then(function(headerBar) {
        headerBar.setTextColor(WelcomeConfig.colors.textColor);
        headerBar.setBackgroundColor(WelcomeConfig.colors.backgroundColor);
        headerBar.hideBackButtonText();

        return new WelcomeHeaderController(headerBar);
    });
};

WelcomeHeaderController.prototype.generateContent = function() {
    var headerContent = {
        header: {
            centerIcon: WelcomeConfig.headerContent,
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

module.exports = WelcomeHeaderController;

import Promise from 'bluebird';
import HeaderBarPlugin from 'astro/plugins/headerBarPlugin';
import WelcomeConfig from '../../app-config/welcomeConfig';

const WelcomeHeaderController = function(headerBar) {
    this.viewPlugin = headerBar;
};

WelcomeHeaderController.init = async function() {
    const headerBar = await HeaderBarPlugin.init();
    headerBar.setTextColor(WelcomeConfig.colors.textColor);
    headerBar.setBackgroundColor(WelcomeConfig.colors.backgroundColor);
    headerBar.hideBackButtonText();

    return new WelcomeHeaderController(headerBar);
};

WelcomeHeaderController.prototype.generateContent = function() {
    const headerContent = {
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

    this.viewPlugin.on(`click:${WelcomeConfig.closeIcon.id}`, callback);
};

WelcomeHeaderController.prototype.registerBackEventHandler = function(callback) {
    if (!callback) {
        return;
    }

    this.viewPlugin.on('click:back', callback);
};

export default WelcomeHeaderController;

import Application from 'astro/application';

const DeepLinkingServices = function(menuController) {
    this.menuController = menuController;

    this._bindStartUp();
    this._bindRunning();
};

DeepLinkingServices.prototype._bindStartUp = function() {
    Application.getStartUri().then((uri) => {
        if (uri !== null) {
            this.menuController.navigateActiveItem(uri);
        }
    });
};

DeepLinkingServices.prototype._bindRunning = function() {
    // Listen for deep link events once app is running
    Application.on('receivedDeepLink', (params) => {
        const uri = params.uri;
        if (uri !== null) {
            this.menuController.navigateActiveItem(uri);
        }
    });
};

export default DeepLinkingServices;

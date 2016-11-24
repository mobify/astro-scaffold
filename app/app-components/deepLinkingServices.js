import Application from 'astro/application';

var DeepLinkingServices = function(menuController) {
    this.menuController = menuController;

    this._bindStartUp();
    this._bindRunning();
};

DeepLinkingServices.prototype._bindStartUp = function() {
    var self = this;
    Application.getStartUri().then(function(uri) {
        if (uri !== null) {
            self.menuController.navigateActiveItem(uri);
        }
    });
};

DeepLinkingServices.prototype._bindRunning = function() {
    var self = this;
    // Listen for deep link events once app is running
    Application.on('receivedDeepLink', function(params) {
        var uri = params.uri;
        if (uri !== null) {
            self.menuController.navigateActiveItem(uri);
        }
    });
};

module.exports = DeepLinkingServices;

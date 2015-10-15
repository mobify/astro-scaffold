define([
    'application'
],
function(
    Application
) {
    var DeepLinkingServices = function(navigate) {
        this.navigate = navigate;

        this._bindStartUp();
        this._bindRunning();
    };

    DeepLinkingServices.prototype._bindStartUp = function() {
        Application.getStartUri().then(function(uri) {
            if (uri != null) {
                this.navigate(uri);
            }
        }.bind(this));
    };

    DeepLinkingServices.prototype._bindRunning = function() {
        // Listen for deep link events once app is running
        Application.on('receivedDeepLink', function(params) {
            var uri = params.uri;
            if (uri != null) {
                this.navigate(uri);
            }
        }.bind(this));
    };

    return DeepLinkingServices;
});

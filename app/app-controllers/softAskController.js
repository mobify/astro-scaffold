define([
    'bluebird',
    'plugins/alertViewPlugin'
],
function(
    Promise,
    AlertViewPlugin
) {
    var SoftAskController = function(pushPlugin) {
        this.pushPlugin = pushPlugin;
    };

    SoftAskController.init = function(pushPluginPromise) {
        return pushPluginPromise.then(function(pushPlugin) {
            return new SoftAskController(pushPlugin);
        });
    };

    SoftAskController.prototype.showSoftAsk = function(title, message) {
        var self = this;
        var alertViewShowPromise = AlertViewPlugin.init().then(
            function(alertView) {
                alertView.setTitle(title);
                alertView.setText(message);
                alertView.addOkButton('Yes');
                alertView.addCancelButton();
                return alertView.show();
            }
        );
        alertViewShowPromise.then(function(okPressed) {
            if (okPressed) {
                self.pushPlugin.subscribe();
            }
        });
    };

    return SoftAskController;
});

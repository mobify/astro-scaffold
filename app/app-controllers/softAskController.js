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
        AlertViewPlugin.init().then(function(alertView) {
            alertView.setTitle(title);
            alertView.setText(message);
            alertView.addOkButton("Yes");
            alertView.addCancelButton();
            alertView.show().then(function(okPressed) {
                if (okPressed) {
                    self.pushPlugin.subscribe();
                }
            });
        });
    };

    return SoftAskController;
});

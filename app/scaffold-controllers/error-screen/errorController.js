define([
    'astro-full',
    'app-rpc',
    'bluebird',
    'config/errorConfig',
    'config/baseConfig',
    'plugins/webViewPlugin',
    'plugins/modalViewPlugin'
/* eslint-disable */
], function(
    Astro,
    AppRpc,
    Promise,
    ErrorConfig,
    BaseConfig,
    WebViewPlugin,
    ModalViewPlugin
) {
/* eslint-enable */

    var ErrorController = function(modalView, webView) {
        this.isShowing = false;
        this.viewPlugin = webView;
        this.modalView = modalView;
        this.errorType = null;
    };

    ErrorController.init = function() {
        return Promise.join(
            WebViewPlugin.init(),
            ModalViewPlugin.init(),
        function(webView, modalView) {
            var loader = webView.getLoader();
            loader.setColor(BaseConfig.loaderColor);
            webView.disableScrollBounce();
            modalView.setContentView(webView);

            var errorController = new ErrorController(modalView, webView);
            Astro.registerRpcMethod(AppRpc.names.errorContent, [], function(res) {
                res.send(null, errorController.errorContent());
            });
            return errorController;
        });
    };

    ErrorController.prototype.show = function() {
        if (this.isShowing) {
            return;
        }
        this.isShowing = true;
        this.modalView.show({animated: true});
    };

    ErrorController.prototype.hide = function() {
        this.isShowing = false;
        this.modalView.hide({animated: true});
    };

    ErrorController.prototype.errorContent = function() {
        if (!this.errorType) {
            return null;
        }
        return ErrorConfig.errors[this.errorType];
    };

    // Remove the events when the modal is hidden otherwise untriggered
    // `once()` events will still exist on the errorModal and cause
    // inconsistent navigation/web view behaviour
    ErrorController.prototype._removeModalEvents = function() {
        this.viewPlugin.off('retry');
        this.viewPlugin.off('back');
    };

    ErrorController.prototype._generateErrorCallback = function(errorType, params) {
        var self = this;
        var backHandler = params.backHandler;
        var retryHandler = params.retryHandler;
        var isActiveItem = params.isActiveItem;

        return function(eventArgs) {
            if (isActiveItem()) {
                // Wait until the error page is loaded before showing
                self.viewPlugin.on('error:loaded', function() {
                    self.show();
                });

                self.viewPlugin.once('back', function() {
                    self.hide();
                    self._removeModalEvents();
                    backHandler();
                });
                self.errorType = errorType;
                self.viewPlugin.navigate(ErrorConfig.url);
            }
            // We allow inactive views to listen for `retry` so that views
            // which also tried to navigate without connectivity will reload
            // when the error modal's retry button is pressed
            self.viewPlugin.once('retry', function() {
                self.hide();
                self._removeModalEvents();
                retryHandler(eventArgs);
            });
        };
    };

    ErrorController.prototype.bindToNavigator = function(params) {
        var navigator = params.navigator;

        // Listen for triggered events emitted by the navigator
        navigator.on('pageTimeout', this._generateErrorCallback('pageTimeout', params));
        navigator.on('noInternetConnection', this._generateErrorCallback('noInternetConnection', params));
    };

    return ErrorController;
});

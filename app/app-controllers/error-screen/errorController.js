define([
    'astro-full',
    'bluebird',
    'config/errorConfig',
    'config/baseConfig',
    'plugins/webViewPlugin',
    'plugins/modalViewPlugin'
/* eslint-disable */
], function(
    Astro,
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
        this.canGoBack = false;

        // Navigate to the error page to set up event
        // listeners/handlers on the web side.
        this.viewPlugin.navigate(ErrorConfig.url);
    };

    ErrorController.init = function() {
        return Promise.join(
            WebViewPlugin.init(),
            ModalViewPlugin.init(),
        function(webView, modalView) {
            webView.getLoader().setColor(BaseConfig.loaderColor);
            webView.disableScrollBounce();
            modalView.setContentView(webView);

            return new ErrorController(modalView, webView);
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

        var errorContent = ErrorConfig.errors[this.errorType];
        errorContent.canGoBack = this.canGoBack;

        return errorContent;
    };

    // Remove the events when the modal is hidden otherwise untriggered
    // `once()` events will still exist on the errorModal and cause
    // inconsistent navigation/web view behaviour
    ErrorController.prototype._removeModalEvents = function() {
        this.viewPlugin.off('retry');
        this.viewPlugin.off('back');
    };

    ErrorController.prototype._generateErrorCallback = function(params) {
        var self = this;
        var navigator = params.navigator;
        var backHandler = params.backHandler;
        var retryHandler = params.retryHandler;
        var isActiveItem = params.isActiveItem;
        var canGoBack = params.canGoBack;

        return function(eventArgs) {
            navigator.loaded = false;

            if (isActiveItem()) {
                self.viewPlugin.once('back', function() {
                    self.hide();
                    self._removeModalEvents();
                    backHandler();
                });

                // Wait until the error page is loaded before showing
                self.viewPlugin.on('astro:page-loaded', function() {
                    self.show();
                });

                self.errorType = errorType;
                canGoBack().then(function(canGoBack) {
                    self.canGoBack = canGoBack;
                    var loadParams = {
                        errorContent: self.errorContent()
                    };

                    self.viewPlugin.trigger('error:should-load', loadParams);
                });
            }

            // Wait until the error page is loaded before showing
            self.viewPlugin.on('error:loaded', function() {
                self.show();
            });

            if (eventArgs.error.code == WebViewPlugin.errorCodes.PageTimeout) {
                self.errorType = "pageTimeout";
            } else if (eventArgs.error.code == WebViewPlugin.errorCodes.NoInternetConnection) {
                self.errorType = "noInternetConnection";
            }

            self.viewPlugin.navigate(ErrorConfig.url);

            // We allow all views that triggered this modal to listen for
            // `retry` so that they will reload when the error modal's retry
            // button is pressed
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
        navigator.on('navigationFailed', this._generateErrorCallback(params));
    };

    return ErrorController;
});

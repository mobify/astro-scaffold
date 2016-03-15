define([
    'bluebird',
    'astro-rpc',
    'config/errorConfig',
    'config/baseConfig',
    'plugins/webViewPlugin',
    'plugins/modalViewPlugin'
], function(
    Promise,
    AstroRpc,
    ErrorConfig,
    BaseConfig,
    WebViewPlugin,
    ModalViewPlugin
) {
    var NO_INTERNET_PAGE = ErrorConfig.errors.connectivityError.url;

    var ErrorController = function(modalView, webView) {
        this.isShowing = false;
        this.viewPlugin = webView;
        this.modalView = modalView;
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

    // Remove the events once the modal is hidden or else some untriggered
    // once events will still exist on the errorModal page and create
    // inconsitant behaviour in the navigation/web views
    ErrorController.prototype._removeModalEvents = function() {
        this.viewPlugin.off('retry');
        this.viewPlugin.off('back');
    };

    ErrorController.prototype._generateNoInternetCallback = function(params) {
        var self = this;
        var backHandler = params.backHandler;
        var retryHandler = params.retryHandler;
        var isActiveItem = params.isActiveItem;
        return function(eventArgs) {
            if (isActiveItem()) {
                self.viewPlugin.navigate(NO_INTERNET_PAGE);
                // Wait until the error page is loaded before showing
                self.viewPlugin.on('error:loaded', function() {
                    self.show();
                });

                self.viewPlugin.once('back', function() {
                    self.hide();
                    self._removeModalEvents();
                    backHandler();
                });
            }
            // We allow non-Active items to listen for `retry` so that views
            // which also tried to navigate without connectivity will reload
            // when the retry button is pressed
            self.viewPlugin.once('retry', function() {
                self.hide();
                self._removeModalEvents();
                retryHandler(eventArgs);
            });
        };
    };

    ErrorController.prototype.bindToNavigator = function(params) {
        var navigator = params.navigator;
        navigator.on('pageTimeout', this._generateNoInternetCallback(params));
        navigator.on('noInternetConnection', this._generateNoInternetCallback(params));
    };

    return ErrorController;
});

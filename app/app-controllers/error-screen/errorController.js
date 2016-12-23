import Promise from 'bluebird';
import WebViewPlugin from 'astro/plugins/webViewPlugin';
import ModalViewPlugin from 'astro/plugins/modalViewPlugin';
import ErrorConfig from '../../app-config/errorConfig';
import BaseConfig from '../../app-config/baseConfig';

const ErrorController = function(modalView, webView) {
    this.isShowing = false;
    this.viewPlugin = webView;
    this.modalView = modalView;
    this.errorType = null;
    this.canGoBack = false;

    // Navigate to the error page to set up event
    // listeners/handlers on the web side.
    this.viewPlugin.navigate(ErrorConfig.url);
};

ErrorController.init = async function() {
    const [
        webView,
        modalView
    ] = await Promise.all([
        WebViewPlugin.init(),
        ModalViewPlugin.init()
    ]);

    webView.getLoader().setColor(BaseConfig.loaderColor);
    webView.disableScrollBounce();
    modalView.setContentView(webView);

    return new ErrorController(modalView, webView);
};

ErrorController.prototype.handleHardwareBackButtonPress = function() {
    this.viewPlugin.events.trigger('back');
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

    const errorContent = ErrorConfig.errors[this.errorType];
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
    const self = this;
    const navigator = params.navigator;
    const backHandler = params.backHandler;
    const retryHandler = params.retryHandler;
    const isActiveItem = params.isActiveItem;
    const canGoBack = params.canGoBack;

    return function(eventArgs) {
        navigator.loaded = false;

        if (eventArgs.error.code === WebViewPlugin.errorCodes.PageTimeout) {
            self.errorType = 'pageTimeout';
        } else if (eventArgs.error.code === WebViewPlugin.errorCodes.NoInternetConnection) {
            self.errorType = 'noInternetConnection';
        }

        // Only trigger the error modal if the active navigation view is
        // the one that failed to load.
        if (isActiveItem()) {
            self.viewPlugin.once('back', () => {
                if (self.canGoBack) {
                    self.hide();
                    self._removeModalEvents();
                    backHandler();
                }
            });

            // Wait until the error page is loaded before showing
            self.viewPlugin.on('astro:page-loaded', () => {
                self.show();
            });

            canGoBack().then((canGoBack) => {
                self.canGoBack = canGoBack;
                const loadParams = {
                    errorContent: self.errorContent()
                };
                self.viewPlugin.trigger('error:should-load', loadParams);
            });
        }

        // We allow all views that triggered this modal to listen for
        // `retry` so that they will reload when the error modal's retry
        // button is pressed
        self.viewPlugin.once('retry', () => {
            self.hide();
            self._removeModalEvents();
            retryHandler(eventArgs);
        });
    };
};

ErrorController.prototype.bindToNavigator = function(params) {
    const navigator = params.navigator;

    // Listen for triggered events emitted by the navigator
    navigator.on('navigationFailed', this._generateErrorCallback(params));
};

export default ErrorController;

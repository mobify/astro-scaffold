import Promise from 'bluebird';
import WebViewPlugin from 'astro/plugins/webViewPlugin';
import AnchoredLayoutPlugin from 'astro/plugins/anchoredLayoutPlugin';
import BaseConfig from '../../app-config/baseConfig';
import CartConfig from '../../app-config/cartConfig';
import CartHeaderController from './cartHeaderController';

const CartController = function(headerController, layout, webView) {
    this.viewPlugin = layout;

    this.webView = webView;
    this.headerController = headerController;
};

CartController.init = async function() {
    const [
        headerController,
        layout,
        webView
    ] = await Promise.all([
        CartHeaderController.init(),
        AnchoredLayoutPlugin.init(),
        WebViewPlugin.init()
    ]);

    const loader = webView.getLoader();
    loader.setColor(BaseConfig.loaderColor);
    webView.navigate(CartConfig.url);

    layout.addTopView(headerController.viewPlugin);
    layout.setContentView(webView);

    return new CartController(headerController, layout, webView);
};

CartController.prototype.registerCloseEventHandler = function(callback) {
    if (!callback) {
        return;
    }
    this.headerController.registerCloseEventHandler(callback);
};

CartController.prototype.navigate = function(url) {
    this.webView.navigate(url);
};

CartController.prototype.reload = function() {
    this.webView.navigate(CartConfig.url);
};

CartController.prototype.back = function() {
    return this.webView.back();
};

export default CartController;

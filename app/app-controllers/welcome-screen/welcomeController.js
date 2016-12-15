import Promise from 'bluebird';
import Astro from 'astro/astro-full';
import WebViewPlugin from 'astro/plugins/webViewPlugin';
import NavigationPlugin from 'astro/plugins/navigationPlugin';
import AnchoredLayoutPlugin from 'astro/plugins/anchoredLayoutPlugin';
import BaseConfig from '../../app-config/baseConfig';
import AppRpc from '../../global/app-rpc';
import WelcomeConfig from '../../app-config/welcomeConfig';
import WelcomeHeaderController from './welcomeHeaderController';

const WelcomeController = function(navigationView, layout, headerController) {
    this.viewPlugin = layout;

    this.navigationView = navigationView;
    this.headerController = headerController;
};

WelcomeController.init = function() {
    // To hook up your own custom native welcome plugin, you can
    // modify the initializers below and either:
    //
    //  1. With a NavigationPlugin, use the navigationView and
    //     call the `navigateToPlugin()` method to navigate to
    //     your custom plugin.
    //  2. Without using a NavigationPlugin or WebViewPlugin,
    //     set the custom plugin as the content view of the layout.

    // With a header bar, we use a navigationPlugin to handle
    // navigation and stacking animations.
    const initWithHeader = async function() {
        const [
            navigationView,
            layout,
            headerController
        ] = await Promise.all([
            NavigationPlugin.init(),
            AnchoredLayoutPlugin.init(),
            WelcomeHeaderController.init()
        ]);

        const loader = navigationView.getLoader();
        loader.setColor(BaseConfig.loaderColor);
        navigationView.setHeaderBar(headerController.viewPlugin);
        headerController.registerBackEventHandler(() => {
            navigationView.back();
        });

        // Remove this line if you wish to enable scrolling
        // in your welcome screen
        navigationView.disableScrolling();

        layout.addTopView(headerController.viewPlugin);
        layout.setContentView(navigationView);

        const welcomeController = new WelcomeController(navigationView, layout, headerController);
        welcomeController.navigate(WelcomeConfig.url);
        return welcomeController;
    };

    // To navigate without stacking, we use a WebViewPlugin to
    // handle navigation -- desired behaviour w/o header
    const initWithoutHeader = async function() {
        const [
            webView,
            layout
        ] = await Promise.all([
            WebViewPlugin.init(),
            AnchoredLayoutPlugin.init()
        ]);

        // Disable webview loader when first loading welcome page
        webView.disableLoader();

        const loader = webView.getLoader();
        loader.setColor(BaseConfig.loaderColor);
        layout.setContentView(webView);

        // Remove this line to enable scrolling on welcome screen
        webView.disableScrolling();

        const welcomeController = new WelcomeController(webView, layout);
        welcomeController.navigate(WelcomeConfig.url);

        return welcomeController;
    };

    Astro.registerRpcMethod(AppRpc.names.welcomeHasHeader, [], (res) => {
        res.send(null, WelcomeConfig.showHeader);
    });

    return (WelcomeConfig.showHeader)
        ? initWithHeader()
        : initWithoutHeader();
};

WelcomeController.prototype.registerCloseEventHandler = function(callback) {
    if (!callback) {
        return;
    }
    if (this.headerController) {
        this.headerController.registerCloseEventHandler(callback);
    }
};

WelcomeController.prototype.navigate = async function(url) {
    if (!url) {
        return null;
    }

    const self = this;
    // Without a header controller, we do not need to generate header
    // content for the navigation. Instead, we allow the webView to
    // simply navigate.
    if (!self.headerController) {
        self.navigationView.navigate(url);
        return null;
    }

    const navigationHandler = function(params) {
        const url = params.url;
        // We're expected to navigate the web view if we're called with a
        // url and the web view isn't in the process of redirecting (i.e.
        // `params.isCurrentlyLoading` is not set).
        if (!!url && !params.isCurrentlyLoading) {
            self.navigate(url);
        }
    };

    const headerContent = await self.headerController.generateContent();
    const webViewPluginOptions = {
        navigationHandler,
        enableLoader: []
    };
    return self.navigationView.navigateToUrl(url, headerContent, webViewPluginOptions);
};

WelcomeController.prototype.back = function() {
    this.navigationView.back();
};

WelcomeController.prototype.canGoBack = function() {
    return this.navigationView.canGoBack();
};

export default WelcomeController;

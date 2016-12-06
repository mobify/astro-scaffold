/* global AstroNative */
window.AstroMessages = []; // For debugging messages

// Astro
import Astro from 'astro/astro-full';
import Application from 'astro/application';
import AnchoredLayoutPlugin from 'astro/plugins/anchoredLayoutPlugin';
import MobifyPreviewPlugin from 'astro/plugins/mobifyPreviewPlugin';
import CounterBadgeController from 'astro/controllers/counterBadgeController';
import PreviewController from 'astro/controllers/previewController';

// Npm
import Promise from 'bluebird';

// Local
import AppRpc from './global/app-rpc';
import BaseConfig from './app-config/baseConfig';
import HeaderConfig from './app-config/headerConfig';
import DeepLinkingServices from './app-components/deepLinkingServices';
import TabBarController from './app-controllers/tabBarController';
import DrawerController from './app-controllers/drawerController';
import CartModalController from './app-controllers/cart/cartModalController';
import ErrorController from './app-controllers/error-screen/errorController';
import WelcomeModalController from './app-controllers/welcome-screen/welcomeModalController';

window.run = async function() {
    // eslint-disable-next-line
    let deepLinkingServices = null;
    const errorControllerPromise = ErrorController.init();
    const cartModalControllerPromise = CartModalController.init(errorControllerPromise);
    const cartEventHandlerPromise = cartModalControllerPromise.then(
        (cartModalController) => {
            return function() {
                cartModalController.show();
            };
        });

    const counterBadgeControllerPromise = CounterBadgeController.init(
        HeaderConfig.cartHeaderContent.imageUrl,
        HeaderConfig.cartHeaderContent.id
    ).then((counterBadgeController) => {
        counterBadgeController.updateCounterValue(3);
        return counterBadgeController;
    });

    // Android hardware back
    const setupHardwareBackButton = function(alternativeBackFunction) {
        Application.on('backButtonPressed', () => {
            Promise.join(
                cartModalControllerPromise,
                errorControllerPromise,
            (cartModalController, errorController) => {
                if (cartModalController.isShowing) {
                    cartModalController.hide();
                } else if (errorController.isShowing) {
                    errorController.handleHardwareBackButtonPress();
                } else {
                    alternativeBackFunction();
                }
            });
        });
    };

    const createTabBarLayout = function() {
        const layoutPromise = AnchoredLayoutPlugin.init();
        const tabBarControllerPromise = TabBarController.init(
                layoutPromise,
                cartEventHandlerPromise,
                counterBadgeControllerPromise,
                errorControllerPromise
            );

        const layoutSetupPromise = Promise.join(
            layoutPromise,
            tabBarControllerPromise,
        (layout, tabBarController) => {
            layout.addBottomView(tabBarController.tabBar);

            return Application.setMainViewPlugin(layout);
        });

        // Tab layout must be added as the mainViewPlugin before
        // The first tab is selected or else the navigation does
        // not complete correctly
        // Note: The first tab will be pre-selected by tabBarPlugin by default
        return Promise.join(
            tabBarControllerPromise,
            layoutSetupPromise,
        (tabBarController) => {
            setupHardwareBackButton(tabBarController.backActiveItem.bind(tabBarController));
            return tabBarController;
        });
    };

    const createDrawerLayout = function() {
        return DrawerController.init(
            counterBadgeControllerPromise,
            cartEventHandlerPromise,
            errorControllerPromise
        ).then((drawerController) => {
            Application.setMainViewPlugin(drawerController.drawer);
            setupHardwareBackButton(drawerController.backActiveItem.bind(drawerController));

            Astro.registerRpcMethod(AppRpc.names.navigateToNewRootView, ['url', 'title'], (res, url, title) => {
                drawerController.navigateToNewRootView(url, title);
                res.send(null, 'success');
            });
            return drawerController;
        });
    };

    const createLayout = async function() {
        return BaseConfig.useTabLayout
            ? createTabBarLayout()
            : createDrawerLayout();
    };

    const initMainLayout = async function() {
        const layoutController = await createLayout();
        Application.dismissLaunchImage();

        // Deep linking services will enable deep linking on startup
        // and while running it will open the deep link in the current
        // active tab
        // eslint-disable-no-unused-vars
        deepLinkingServices = new DeepLinkingServices(layoutController);
    };

    const runApp = async function() {
        const welcomeModalController = await WelcomeModalController.init(errorControllerPromise);

        // The welcome modal can be configured to show only once
        // (on first launch) by setting `{forced: false}` as the
        // parameter for welcomeModalController.show()
        welcomeModalController.show({forced: true});
        initMainLayout();
    };

    const runAppPreview = async function() {
        const previewPlugin = await MobifyPreviewPlugin.init();
        await previewPlugin.preview(BaseConfig.baseURL, BaseConfig.previewBundle);
        runApp();
    };

    const initalizeAppWithAstroPreview = async function() {
        const previewController = await PreviewController.init();

        Application.on('previewToggled', () => {
            previewController.presentPreviewAlert();
        });

        const previewEnabled = await previewController.isPreviewEnabled();
        if (previewEnabled) {
            runAppPreview();
        } else {
            runApp();
        }
    };

    if (AstroNative.Configuration.ASTRO_PREVIEW) {
        initalizeAppWithAstroPreview();
    } else {
        runApp();
    }
};

// Comment out next line for JS debugging
window.run();

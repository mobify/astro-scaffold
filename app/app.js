/* global AstroNative */
window.AstroMessages = []; // For debugging messages

// Astro
import Astro from 'astro/astro-full';
import Application from 'astro/application';
import AnchoredLayoutPlugin from 'astro/plugins/anchoredLayoutPlugin';
import MobifyPreviewPlugin from 'astro/plugins/mobifyPreviewPlugin';
import CounterBadgeController from 'astro/controllers/counterBadgeController';
import PreviewController from 'astro/controllers/previewController';

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

    const errorController = await ErrorController.init();
    const cartModalController = await CartModalController.init(errorController);
    const cartEventHandler = () => cartModalController.show();

    const counterBadgeController = await CounterBadgeController.init(
        HeaderConfig.cartHeaderContent.imageUrl,
        HeaderConfig.cartHeaderContent.id
    );
    counterBadgeController.updateCounterValue(3);

    // Android hardware back
    const setupHardwareBackButton = async (alternativeBackFunction) => {
        Application.on('backButtonPressed', () => {
            if (cartModalController.isShowing) {
                cartModalController.hide();
            } else if (errorController.isShowing) {
                errorController.handleHardwareBackButtonPress();
            } else {
                alternativeBackFunction();
            }
        });
    };

    const createLayout = async () => {
        const layout = await AnchoredLayoutPlugin.init();
        const tabBarController = await TabBarController.init(
            layout,
            cartEventHandler,
            counterBadgeController,
            errorController
        );

        layout.addBottomView(tabBarController.tabBar);
        await Application.setMainViewPlugin(layout);

        // Tab layout must be added as the mainViewPlugin before
        // The first tab is selected or else the navigation does
        // not complete correctly
        // Note: The first tab will be pre-selected by tabBarPlugin by default
        setupHardwareBackButton(tabBarController.backActiveItem.bind(tabBarController));
        return tabBarController;
    };

    const runApp = async () => {
        const welcomeModalController = await WelcomeModalController.init(errorController);

        // The welcome modal can be configured to show only once
        // (on first launch) by setting `{forced: false}` as the
        // parameter for welcomeModalController.show()
        welcomeModalController.show({forced: true});

        const layoutController = await createLayout();
        Application.dismissLaunchImage();

        // Deep linking services will enable deep linking on startup
        // and while running it will open the deep link in the current
        // active tab
        // eslint-disable-no-unused-vars
        deepLinkingServices = new DeepLinkingServices(layoutController);
    };

    const runAppPreview = async () => {
        const previewPlugin = await MobifyPreviewPlugin.init();
        await previewPlugin.preview(BaseConfig.baseURL, BaseConfig.previewBundle);
        runApp();
    };

    const initalizeAppWithAstroPreview = async () => {
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

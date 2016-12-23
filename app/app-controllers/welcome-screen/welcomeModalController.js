import Promise from 'bluebird';
import Astro from 'astro/astro-full';
import Application from 'astro/application';
import ModalViewPlugin from 'astro/plugins/modalViewPlugin';
import SettingsStore from 'astro/settings-store';
import AppEvents from '../../global/app-events';
import AppRpc from '../../global/app-rpc';
import WelcomeController from './welcomeController';

const WelcomeModalController = function(modalView, welcomeController) {
    this.isShowing = false;
    this.modalView = modalView;
    this.welcomeController = welcomeController;
};

WelcomeModalController.init = async function(errorController) {
    const [
        modalView,
        welcomeController
    ] = await Promise.all([
        ModalViewPlugin.init(),
        WelcomeController.init()
    ]);

    modalView.setContentView(welcomeController.viewPlugin);

    // This registers a close handler on the header bar to dismiss
    // the modal. Without a header bar, the developer is responsible
    // for implementing a way to dismiss the modal.
    const welcomeModalController = new WelcomeModalController(modalView, welcomeController);
    welcomeController.registerCloseEventHandler(() => {
        welcomeModalController.hide();
    });

    // Welcome modal RPCs
    Astro.registerRpcMethod(AppRpc.names.welcomeShow, [], () => {
        welcomeModalController.show({forced: true});
    });

    Astro.registerRpcMethod(AppRpc.names.welcomeHide, [], () => {
        welcomeModalController.hide();
    });

    // If you have implemented your own custom native welcome plugin
    // you may also need to modify the following error modal handlers
    const navigator = welcomeController.navigationView;
    const backHandler = function() {
        // We only navigate back if our navigator is a navigationView.
        // webViewPlugins do not complete navigation if they fail.
        if (typeof navigator.getEventPluginPromise === 'function') {
            navigator.back();
        }
    };

    const retryHandler = function(params) {
        if (!params.url) {
            return;
        }
        if (typeof navigator.getEventPluginPromise === 'function') {
            const navigate = function(eventPlugin) {
                eventPlugin.navigate(params.url);
            };
            navigator.getEventPluginPromise(params).then(navigate);
        } else {
            navigator.navigate(params.url);
        }
    };

    // Welcome modal should never dismiss unless the user has
    // completed the welcome flow.
    const canGoBack = function() {
        return Promise.resolve(false);
    };

    errorController.bindToNavigator({
        navigator,
        backHandler,
        retryHandler,
        isActiveItem: welcomeModalController.isActiveItem,
        canGoBack
    });
    return welcomeModalController;
};

WelcomeModalController.prototype.show = async function(params) {
    const self = this;
    params = Astro.Utils.extend({forced: false}, params);

    const [
        appInfo,
        previousInstallationID
    ] = await Promise.all([
        Application.getAppInformation(),
        SettingsStore.get('installationID')
    ]);

    // Welcome modal should be triggered when installationID changes
    // NOTE: appInfo.installationID appears to be different on each app run
    // on the iOS Simulator, but on real devices they will persist.
    if (appInfo.installationID !== previousInstallationID || params.forced) {
        self.isShowing = true;
        self.modalView.show({animated: true});

        // Promise will be resolved when welcome modal is dismissed
        AppEvents.on(AppEvents.names.welcomeHidden, () => {
            SettingsStore.set('installationID', appInfo.installationID);
            return;
        });
        AppEvents.trigger(AppEvents.names.welcomeShown);
    } else {
        throw new Error();
    }
};

WelcomeModalController.prototype.hide = function() {
    const self = this;
    self.isShowing = false;
    self.modalView.hide({animated: true});
    AppEvents.trigger(AppEvents.names.welcomeHidden);
};

WelcomeModalController.prototype.isActiveItem = function() {
    return this.isShowing;
};

WelcomeModalController.prototype.canGoBack = function() {
    return this.welcomeController.canGoBack();
};

export default WelcomeModalController;

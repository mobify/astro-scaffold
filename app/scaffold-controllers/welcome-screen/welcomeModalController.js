define([
    'astro-full',
    'astro-rpc',
    'bluebird',
    'plugins/modalViewPlugin',
    'plugins/secureStorePlugin',
    'scaffold-controllers/welcome-screen/welcomeController'
],
/* eslint-disable */
function(
    Astro,
    AstroRpc,
    Promise,
    ModalViewPlugin,
    SecureStorePlugin,
    WelcomeController
) {
/* eslint-enable */

    var WelcomeModalController = function(modalView, welcomeController, secureStore) {
        this.isShowing = false;
        this.modalView = modalView;
        this._secureStore = secureStore;
        this.welcomeController = welcomeController;
    };

    WelcomeModalController.init = function(errorControllerPromise) {
        return Promise.join(
            ModalViewPlugin.init(),
            WelcomeController.init(),
            SecureStorePlugin.init(),
            errorControllerPromise,
        function(modalView, welcomeController, secureStore, errorController) {
            modalView.setContentView(welcomeController.viewPlugin);

            // This registers a close handler on the header bar to dismiss
            // the modal. Without a header bar, the developer is responsible
            // for implementing a way to dismiss the modal.
            var welcomeModalController = new WelcomeModalController(modalView, welcomeController, secureStore);
            welcomeController.registerCloseEventHandler(function() {
                welcomeModalController.hide();
            });

            // Welcome modal RPCs
            Astro.registerRpcMethod(AstroRpc.names.welcomeShow, [], function(res) {
                welcomeModalController.show({forced: true});
            });

            Astro.registerRpcMethod(AstroRpc.names.welcomeHide, [], function(res) {
                welcomeModalController.hide();
            });

            // If you have implemented your own custom native welcome plugin
            // you may also need to modify the following error modal handlers
            var navigator = welcomeController.navigationView;
            var backHandler = function() {
                // We only navigate back if our navigator is a navigationView.
                // webViewPlugins do not complete navigation if they fail.
                if (typeof navigator.getEventPluginPromise === 'function') {
                    navigator.back();
                }
            };

            var retryHandler = function(params) {
                if (!params.url) {
                    return;
                }
                if (typeof navigator.getEventPluginPromise === 'function') {
                    var navigate = function(eventPlugin) {
                        eventPlugin.navigate(params.url);
                    };
                    navigator.getEventPluginPromise(params).then(navigate);
                } else {
                    navigator.navigate(params.url);
                }
            };
            errorController.bindToNavigator({
                navigator: navigator,
                backHandler: backHandler,
                retryHandler: retryHandler,
                isActiveItem: welcomeModalController.isActiveItem.bind(welcomeModalController)
            });
            return welcomeModalController;
        });
    };

    WelcomeModalController.prototype.show = function(params) {
        var self = this;
        params = Astro.Utils.extend({forced: false}, params);

        self._secureStore.get('onboarded').then(function(onboarded) {
            if (onboarded !== 'YES' || params.forced) {
                self.isShowing = true;
                self.modalView.show({animated: true});
                self._secureStore.set('onboarded', 'YES');
            }
        });
    };

    WelcomeModalController.prototype.hide = function() {
        var self = this;
        self.isShowing = false;
        self.modalView.hide({animated: true});
    };

    WelcomeModalController.prototype.isActiveItem = function() {
        return this.isShowing;
    };

    WelcomeModalController.prototype.canGoBack = function() {
        return this.welcomeController.canGoBack();
    };

    return WelcomeModalController;
});

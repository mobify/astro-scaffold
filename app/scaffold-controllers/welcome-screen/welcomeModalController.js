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

    var WelcomeModalController = function(modalView, secureStore) {
        this.isShowing = false;
        this.modalView = modalView;
        this._secureStore = secureStore;
    };

    WelcomeModalController.init = function() {
        return Promise.join(
            ModalViewPlugin.init(),
            WelcomeController.init(),
            SecureStorePlugin.init(),
        function(modalView, welcomeController, secureStore) {
            modalView.setContentView(welcomeController.viewPlugin);

            // This registers a close handler on the header bar to dismiss
            // the modal. Without a header bar, the developer is responsible
            // for implementing a way to dismiss the modal.
            var welcomeModalController = new WelcomeModalController(modalView, secureStore);
            welcomeController.registerCloseEventHandler(function() {
                welcomeModalController.hide();
            });

            // Welcome modal RPCs
            Astro.registerRpcMethod(AstroRpc.names.showWelcome, [], function(res) {
                welcomeModalController.show({forced: true});
            });

            Astro.registerRpcMethod(AstroRpc.names.hideWelcome, [], function(res) {
                welcomeModalController.hide();
            });

            return welcomeModalController;
        });
    };

    WelcomeModalController.prototype.show = function(params) {
        var self = this;
        params = Astro.Utils.extend({forced: false}, params);

        this._secureStore.get('onboarded').then(function(onboarded) {
            if (onboarded !== 'YES' || params.forced) {
                self.isShowing = true;
                self.modalView.show({animated: true});
                secureStore.set('onboarded', 'YES');
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
        return this.navigationController.canGoBack();
    };

    return WelcomeModalController;
});

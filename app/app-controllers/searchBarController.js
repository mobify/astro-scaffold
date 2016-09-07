define([
    'application',
    'app-events',
    'app-rpc',
    'bluebird',
    'config/baseConfig',
    'config/searchConfig',
    'app-plugins/searchBarPlugin',
    'plugins/anchoredLayoutPlugin',
    'plugins/webViewPlugin'
],
function(
    Application,
    AppEvents,
    AppRpc,
    Promise,
    BaseConfig,
    SearchConfig,
    SearchBarPlugin,
    AnchoredLayoutPlugin,
    WebViewPlugin
) {
    var SearchBarController = function(
        searchBar,
        parentLayout,
        parentHeaderController,
        parentNavigationView
    ) {
        this.viewPlugin = searchBar;
        this.parentLayout = parentLayout;
        this.parentHeaderController = parentHeaderController;
        this.parentNavigationView = parentNavigationView;

        // Track the state to show.hide keyboard on toggle
        this.isVisible = false;

        registerEvents(this);
        registerRpcs(this);
    };

    SearchBarController.init = function(parentLayoutPromise, parentHeaderController, parentNavigationView) {
        return Promise.join(
            SearchBarPlugin.init(),
            parentLayoutPromise,
            function(searchBar, parentLayout) {
                return new SearchBarController(searchBar, parentLayout, parentHeaderController, parentNavigationView);
            }
        );
    };

    // Returns queryUrl with the string "<search_terms>" replaced with the
    // URI-encoded version of searchTerms
    SearchBarController.prototype.generateSearchUrl = function(searchTerms) {
        return SearchConfig.queryUrl.replace('<search_terms>', encodeURIComponent(searchTerms));
    };

    // You must manually call this for the search bar to be visible
    SearchBarController.prototype.addToLayout = function() {
        this.parentLayout.addTopView(this.viewPlugin);
        this.parentLayout.hideView(this.viewPlugin, {animated: false});
    };

    var registerRpcs = function(self) {
        Astro.registerRpcMethod(AppRpc.names.searchHide, ['params'], function(res, params) {
            self.hide(params)
                .then(function() {
                    res.send(null, true);
                });
        });

        Astro.registerRpcMethod(AppRpc.names.searchIsShowing, [], function(res) {
            res.send(null, self.isShowing());
        });
    };

    var registerEvents = function(self) {
        // Users of SearchBarController can also hook this event
        // to instruct the desired view to act on the search being performed
        // The search terms are expected to be in a string found in
        // params['searchTerms']
        self.viewPlugin.on(AppEvents.names.searchSubmitted, function(params) {
            self.hide({animated: true});
        });

        self.viewPlugin.on(AppEvents.names.searchCancelled, function(params) {
            self.hide({animated: true});
            self.setText('');
        });
    };

    SearchBarController.prototype.blur = function() {
        this.viewPlugin.blur();
    };

    SearchBarController.prototype.focus = function() {
        this.viewPlugin.focus();
    };

    SearchBarController.prototype.setText = function(text) {
        this.viewPlugin.setText(text);
    };

    SearchBarController.prototype.isShowing = function() {
        return this.isVisible;
    };

    SearchBarController.prototype.show = function(options) {
        if (this.isVisible) {
            return;
        }

        var self = this;

        WebViewPlugin.init().then(function(contentWebView) {
            self.parentLayout.showView(self.viewPlugin, options);
            contentWebView.setBackgroundColor('#E6E6E6');
            self.parentLayout.setContentView(contentWebView);
            self.focus();
            self.isVisible = true;
            // self.parentNavigationView.disableScrolling();
            AppEvents.trigger(AppEvents.names.searchShown);
        });
    };

    SearchBarController.prototype.hide = function(options) {
        if (!this.isVisible) {
            return Promise.resolve(true);
        }

        var self = this;
        self.blur();
        self.isVisible = false;

        // Enable scrolling for the underlying content before
        // dismissing so that they animate properly and resturn
        // their previous state.
        // self.parentNavigationView.enableScrolling().then(function() {
            AppEvents.trigger(AppEvents.names.searchHidden);
            if (AstroNative.OSInfo.os === Astro.platforms.ios) {
                self.parentLayout.hideView(self.viewPlugin, options);
                self.parentLayout.setContentView(self.parentNavigationView);
            } else {
                // Animating the keyboard away at the same time as hiding the
                // layout results in a janky keyboard animation on Android.
                // Delaying it a bit makes it look much smoother.
                setTimeout(function() {
                    self.parentLayout.hideView(self.viewPlugin, options);
                    self.parentLayout.setContentView(self.parentNavigationView);
                }, 200);
            }
        // });
    };

    SearchBarController.prototype.toggle = function(options) {
        if (this.isVisible) {
            this.hide(options);
        } else {
            this.show(options);
        }
    };

    SearchBarController.prototype.registerSearchSubmittedEvents = function(callback) {
        if (!callback) {
            return;
        }

        var self = this;
        this.viewPlugin.on(AppEvents.names.searchSubmitted, function(params) {
            callback(params);
        });
    };

    return SearchBarController;
});

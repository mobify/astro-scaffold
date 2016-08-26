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
        internalLayout,
        layout,
        headerController,
        bottomView
    ) {
        this.viewPlugin = searchBar;
        this.internalLayout = internalLayout;
        this.layout = layout;
        this.headerController = headerController;
        this.bottomView = bottomView;

        // Track the state to show.hide keyboard on toggle
        this.isVisible = false;

        registerEvents(this);
        registerRpcs(this);
    };

    SearchBarController.init = function(layoutPromise, headerController, bottomView) {
        return Promise.join(
            SearchBarPlugin.init(),
            AnchoredLayoutPlugin.init(),
            layoutPromise,
            function(searchBar, internalLayout, layout) {
                return new SearchBarController(searchBar, internalLayout, layout, headerController, bottomView);
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

        // We may have to fiddle with these heights going forward once we have
        // test devices for what we need to support for Android. On the ones I'm
        // testing now, this looks good on iOS and Android.
        var barHeight;
        if (AstroNative.OSInfo.os === Astro.platforms.ios) {
            barHeight = 68;
            this.internalLayout.addTopView(this.viewPlugin);
            this.layout.addTopView(this.internalLayout);
        } else {
            barHeight = 60;
            this.internalLayout.addTopView(this.viewPlugin, {height: barHeight});
            this.layout.addTopView(this.internalLayout);
        }

        this.layout.hideView(this.internalLayout, {animated: false});
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

        this.layout.showView(this.internalLayout, options);
        this.focus();
        this.isVisible = true;
        this.bottomView.disableScrolling();
        AppEvents.trigger(AppEvents.names.searchShown);
    };

    SearchBarController.prototype.hide = function(options) {
        if (!this.isVisible) {
            return Promise.resolve(true);
        }

        var self = this;
        self.blur();
        self.isVisible = false;
        if (AstroNative.OSInfo.os === Astro.platforms.ios) {
            // Enable scrolling for the underlying content before
            // dismissing so that they animate properly and resturn
            // their previous state.
            return self.bottomView.enableScrolling().then(function() {
                AppEvents.trigger(AppEvents.names.searchHidden);
                return self.layout.hideView(self.internalLayout, options);
            });
        } else {
            // Animating the keyboard away at the same time as hiding the
            // layout results in a janky keyboard animation on Android.
            // Delaying it a bit makes it look much smoother.
            return self.bottomView.enableScrolling().then(function() {
                AppEvents.trigger(AppEvents.names.searchHidden);
                return new Promise(function(resolve, reject) {
                    setTimeout(function() {
                        resolve(self.layout.hideView(self.internalLayout, options));
                    }, 200);
                });
            });
        }
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

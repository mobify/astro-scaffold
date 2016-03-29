define([
    'bluebird',
    'plugins/webViewPlugin'
],
function(
    Promise,
    WebViewPlugin
) {
    var SearchBarController = function(webView, layout, searchConfig) {
        this.viewPlugin = webView;
        this.layout = layout;
        this.searchConfig = searchConfig;

        // Track the state to show.hide keyboard on toggle
        //
        // Set to true because it will be hidden when added
        // to the parent layout
        this.isVisible = true;

        this._registerEvents();

        this.viewPlugin.navigate(this.searchConfig.uiSource);
        this.viewPlugin.disableScrolling();
    };

    SearchBarController.init = function(layoutPromise, searchConfig) {
        return Promise.join(layoutPromise, WebViewPlugin.init(),
            function(layout, webView) {
                return new SearchBarController(webView, layout, searchConfig);
            }
        );
    };

    // Returns queryUrl with the string "<search_terms>" replaced with the
    // URI-encoded version of searchTerms
    SearchBarController.prototype.generateSearchUrl = function(searchTerms) {
        return this.searchConfig.queryUrl.replace('<search_terms>', encodeURIComponent(searchTerms));
    };

    // You must manually call this for the search bar to be visible
    SearchBarController.prototype.addToLayout = function() {
        this.layout.addTopView(this.viewPlugin, {height: 52});
        this.hide(false); // don't show it by default
    };

    SearchBarController.prototype._registerEvents = function() {
        var self = this;

        // Users of SearchBarController can also hook this event
        // to instruct the desired view to act on the search being performed
        // The search terms are expected to be in a string found in
        // params['searchTerms']
        this.viewPlugin.on('search:submitted', function(params) {
            self.hide(true);
        });

        this.viewPlugin.on('search:cancelled', function(params) {
            self.hide(true);
        });
    };

    SearchBarController.prototype.show = function(animated) {
        if (this.isVisible) {
            return;
        }

        this.layout.showView(this.viewPlugin, {animated: animated});
        this.isVisible = true;
    };

    SearchBarController.prototype.hide = function(animated) {
        if (!this.isVisible) {
            return;
        }

        this.layout.hideView(this.viewPlugin, {animated: animated});
        this.isVisible = false;
    };

    SearchBarController.prototype.toggle = function(animated) {
        if (this.isVisible) {
            this.hide(animated);
        } else {
            this.show(animated);
        }
    };

    SearchBarController.prototype.registerSearchSubmittedEvents = function(callback) {
        if (!callback) {
            return;
        }

        this.viewPlugin.on('search:submitted', callback);
    };

    return SearchBarController;
});

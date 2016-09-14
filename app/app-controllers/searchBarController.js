define([
    'bluebird',
    'plugins/searchBarPlugin',
    'plugins/anchoredLayoutPlugin'
],
function(
    Promise,
    SearchBarPlugin,
    AnchoredLayoutPlugin
) {
    var SearchBarController = function(searchBarPlugin, layout, internalLayout, searchConfig) {
        this.viewPlugin = internalLayout;
        this.layout = layout;
        this.searchBar = searchBarPlugin;
        this.searchConfig = searchConfig;

        // Track the state to show.hide keyboard on toggle
        //
        // Set to true because the 'addToLayout' method hides
        // the search bar (sets isVisible to false) when it is
        // being added to the anchored layout
        // By default views added to the anchored layout are visible
        this.isVisible = true;

        this._registerEvents();
    };

    SearchBarController.init = function(layoutPromise, searchConfig) {
        return Promise.join(layoutPromise, SearchBarPlugin.init(), AnchoredLayoutPlugin.init(),
            function(layout, searchBarPlugin, internalLayout) {
                internalLayout.addTopView(searchBarPlugin);
                return new SearchBarController(searchBarPlugin, layout, internalLayout, searchConfig);
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
        this.layout.addTopView(this.viewPlugin);
        this.hide({animated: false}); // don't show it by default
    };

    SearchBarController.prototype._registerEvents = function() {
        var self = this;
        // Users of SearchBarController can also hook this event
        // to instruct the desired view to act on the search being performed
        // The search terms are expected to be in a string found in
        // params['searchTerms']
        this.searchBar.on('search:submitted', function(params) {
            self.hide();
        });

        this.searchBar.on('search:cancelled', function(params) {
            self.hide();
        });
    };

    SearchBarController.prototype.show = function(options) {
        options = options || (Astro.isRunningInIOSApp() ? {animated: true} : {animated: false});

        if (this.isVisible) {
            return;
        }

        this.searchBar.focus();
        this.layout.showView(this.viewPlugin, options);
        this.isVisible = true;
    };

    SearchBarController.prototype.hide = function(options) {
        options = options || (Astro.isRunningInIOSApp() ? {animated: true} : {animated: false});

        if (!this.isVisible) {
            return;
        }

        this.layout.hideView(this.viewPlugin, options);
        this.isVisible = false;
    };

    SearchBarController.prototype.toggle = function() {
        if (this.isVisible) {
            this.hide();
        } else {
            this.show();
        }
    };

    SearchBarController.prototype.registerSearchSubmittedEvents = function(callback) {
        if (!callback) {
            return;
        }

        this.searchBar.on('search:submitted', callback);
    };

    return SearchBarController;
});

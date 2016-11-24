import Promise from 'bluebird';
import Astro from 'astro/astro-full';
import Application from 'astro/application';
import AnchoredLayoutPlugin from 'astro/plugins/anchoredLayoutPlugin';
import NavigationPlugin from 'astro/plugins/navigationPlugin';
import AppEvents from '../global/app-events';
import BaseConfig from '../app-config/baseConfig';
import SearchConfig from '../app-config/searchConfig';
import NavigationHeaderController from './navigationHeaderController';
import SearchBarController from './searchBarController';
import SegmentedController from './segmentedController';

var NavigationController = function(id, url, layout, navigationView, navigationHeaderController, searchBarController, includeDrawerIcon, segmentedController) {
    this.id = id;
    this.isActive = false;
    this.viewPlugin = layout;
    this.navigationView = navigationView;
    this.navigationHeaderController = navigationHeaderController;
    this.searchBarController = searchBarController;
    this.segmentedController = segmentedController;

    this.navigate(url, includeDrawerIcon);
    this.navigationView.loaded = true;

    var self = this;
    this.searchBarController.registerSearchSubmittedEvents(function(params) {
        var searchUrl = self.searchBarController.generateSearchUrl(params.searchTerms);
        self.segmentedController.showSegmentsForUrl(searchUrl);
        self.navigate(searchUrl);
    });

    bindEvents(this);
};

NavigationController.init = function(
    id,
    url,
    counterBadgeController,
    cartEventHandler,
    errorController,
    drawerEventHandler
) {
    var layoutPromise = AnchoredLayoutPlugin.init();
    var navigationPromise = NavigationPlugin.init();
    var navigationContainerPromise = AnchoredLayoutPlugin.init();

    return Promise.join(
        layoutPromise,
        NavigationHeaderController.init(counterBadgeController),
        navigationPromise,
        navigationContainerPromise,
        SearchBarController.init(layoutPromise, SearchConfig),
        SegmentedController.init(navigationContainerPromise, navigationPromise),
        function(layout, navigationHeaderController, navigationView, navigationViewContainer, searchBarController, segmentedController) {
            navigationView.getLoader().setColor(BaseConfig.loaderColor);

            // Set layout
            navigationViewContainer.setContentView(navigationView);
            layout.setContentView(navigationViewContainer);
            layout.addTopView(navigationHeaderController.viewPlugin);
            navigationView.setHeaderBar(navigationHeaderController.viewPlugin);
            navigationHeaderController.registerBackEvents(function() {
                navigationView.back();
            });

            navigationHeaderController.registerCartEvents(cartEventHandler);

            var drawerIconEnabled = drawerEventHandler !== undefined;
            if (drawerIconEnabled) {
                navigationHeaderController.registerDrawerEvents(drawerEventHandler);
            }

            searchBarController.addToLayout();

            var searchBarToggleCallback = searchBarController.toggle.bind(searchBarController);
            navigationHeaderController.registerSearchBarEvents(searchBarToggleCallback);

            var navigationController = new NavigationController(
                id,
                url,
                layout,
                navigationView,
                navigationHeaderController,
                searchBarController,
                drawerIconEnabled,
                segmentedController
            );

            var backHandler = function() {
                navigationView.back();
                navigationView.loaded = true;
            };

            var retryHandler = function(params) {
                if (!params.url) {
                    return;
                }
                var navigate = function(eventPlugin) {
                    eventPlugin.navigate(params.url);
                    navigationView.loaded = true;
                };
                navigationView.getEventPluginPromise(params).then(navigate);
            };

            errorController.bindToNavigator({
                navigator: navigationView,
                backHandler: backHandler,
                retryHandler: retryHandler,
                isActiveItem: navigationController.isActiveItem.bind(navigationController),
                canGoBack: navigationController.canGoBack.bind(navigationController)
            });
            return navigationController;
        }
    );
};

NavigationController.prototype.navigate = function(url, includeDrawerIcon) {
    if (!url) {
        return Promise.reject();
    }

    var self = this;
    var navigationHandler = function(params) {
        var url = params.url;

        // We're expected to navigate the web view if we're called with a
        // url and the web view isn't in the process of redirecting (i.e.
        // `params.isCurrentlyLoading` is not set).
        if (!!url && !params.isCurrentlyLoading) {
            return self.navigate(url);
        }
    };

    return self.navigationHeaderController.generateContent(includeDrawerIcon)
        .then(function(headerContent) {
            return self.navigationView.navigateToUrl(
                url, headerContent, {navigationHandler: navigationHandler});
        })
        .then(function() {
            return self.navigationHeaderController.setTitle();
        });
};

NavigationController.prototype.navigateMainViewToNewRoot = function(url, title) {
    var self = this;
    this.popToRoot({animated: true})
        .then(function() {
            return self.navigationView.getTopPlugin();
        })
        .then(function(rootWebView) {
            self.navigationHeaderController.setTitle(title);
            if (typeof rootWebView.navigate === 'function') {
                return rootWebView.navigate(url);
            } else {
                // Note: this code branch is untested
                // This would be used if the root plugin is not a WebViewPlugin.
                // In that case, we want to tell the navigation plugin to navigate instead.
                return self.navigate(url, true);
            }
        });
};

NavigationController.prototype.popToRoot = function(params) {
    return this.navigationView.popToRoot(params);
};

NavigationController.prototype.back = function() {
    var self = this;
    self.navigationView.canGoBack().then(function(canGoBack) {
        if (canGoBack) {
            self.navigationView.back();
        } else {
            Application.closeApp();
        }
    });
};

NavigationController.prototype.canGoBack = function() {
    return this.navigationView.canGoBack();
};

NavigationController.prototype.isActiveItem = function() {
    return this.isActive;
};

NavigationController.prototype.needsReload = function() {
    return !this.navigationView.loaded;
};

var bindEvents = function(self) {
    var handleActiveState = function(event) {
        if (self.isActive) {
            AppEvents.once(event, function() {
                self.isActive = true;
            });
        }
        self.isActive = false;
    };

    AppEvents.on(AppEvents.names.welcomeShown, function() {
        handleActiveState(AppEvents.names.welcomeHidden);
    });

    AppEvents.on(AppEvents.names.cartShown, function() {
        handleActiveState(AppEvents.names.cartHidden);
    });
};

module.exports = NavigationController;

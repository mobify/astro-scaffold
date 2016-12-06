import Promise from 'bluebird';
import Application from 'astro/application';
import AnchoredLayoutPlugin from 'astro/plugins/anchoredLayoutPlugin';
import NavigationPlugin from 'astro/plugins/navigationPlugin';
import AppEvents from '../global/app-events';
import BaseConfig from '../app-config/baseConfig';
import SearchConfig from '../app-config/searchConfig';
import NavigationHeaderController from './navigationHeaderController';
import SearchBarController from './searchBarController';
import SegmentedController from './segmentedController';

const bindEvents = function(self) {
    const handleActiveState = (event) => {
        if (self.isActive) {
            AppEvents.once(event, () => {
                self.isActive = true
            });
        }
        self.isActive = false;
    };

    AppEvents.on(AppEvents.names.welcomeShown, () => handleActiveState(AppEvents.names.welcomeHidden));
    AppEvents.on(AppEvents.names.cartShown, () => handleActiveState(AppEvents.names.cartHidden));
};

const NavigationController = function(id, url, layout, navigationView, navigationHeaderController, searchBarController, includeDrawerIcon, segmentedController) {
    this.id = id;
    this.isActive = false;
    this.viewPlugin = layout;
    this.navigationView = navigationView;
    this.navigationHeaderController = navigationHeaderController;
    this.searchBarController = searchBarController;
    this.segmentedController = segmentedController;

    this.navigate(url, includeDrawerIcon);
    this.navigationView.loaded = true;

    this.searchBarController.registerSearchSubmittedEvents((params) => {
        const searchUrl = this.searchBarController.generateSearchUrl(params.searchTerms);
        this.segmentedController.showSegmentsForUrl(searchUrl);
        this.navigate(searchUrl);
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
    const layoutPromise = AnchoredLayoutPlugin.init();
    const navigationPromise = NavigationPlugin.init();
    const navigationContainerPromise = AnchoredLayoutPlugin.init();

    return Promise.join(
        layoutPromise,
        NavigationHeaderController.init(counterBadgeController),
        navigationPromise,
        navigationContainerPromise,
        SearchBarController.init(layoutPromise, SearchConfig),
        SegmentedController.init(navigationContainerPromise, navigationPromise),
        (layout, navigationHeaderController, navigationView, navigationViewContainer, searchBarController, segmentedController) => {
            navigationView.getLoader().setColor(BaseConfig.loaderColor);

            // Set layout
            navigationViewContainer.setContentView(navigationView);
            layout.setContentView(navigationViewContainer);
            layout.addTopView(navigationHeaderController.viewPlugin);
            navigationView.setHeaderBar(navigationHeaderController.viewPlugin);
            navigationHeaderController.registerBackEvents(() => {
                navigationView.back();
            });

            navigationHeaderController.registerCartEvents(cartEventHandler);

            const drawerIconEnabled = drawerEventHandler !== undefined;
            if (drawerIconEnabled) {
                navigationHeaderController.registerDrawerEvents(drawerEventHandler);
            }

            searchBarController.addToLayout();

            const searchBarToggleCallback = searchBarController.toggle.bind(searchBarController);
            navigationHeaderController.registerSearchBarEvents(searchBarToggleCallback);

            const navigationController = new NavigationController(
                id,
                url,
                layout,
                navigationView,
                navigationHeaderController,
                searchBarController,
                drawerIconEnabled,
                segmentedController
            );

            const backHandler = function() {
                navigationView.back();
                navigationView.loaded = true;
            };

            const retryHandler = function(params) {
                if (!params.url) {
                    return;
                }
                const navigate = function(eventPlugin) {
                    eventPlugin.navigate(params.url);
                    navigationView.loaded = true;
                };
                navigationView.getEventPluginPromise(params).then(navigate);
            };

            errorController.bindToNavigator({
                navigator: navigationView,
                backHandler,
                retryHandler,
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

    const navigationHandler = (params) => {
        const url = params.url;

        // We're expected to navigate the web view if we're called with a
        // url and the web view isn't in the process of redirecting (i.e.
        // `params.isCurrentlyLoading` is not set).
        if (!!url && !params.isCurrentlyLoading) {
            return this.navigate(url);
        }
        return null;
    };

    return this.navigationHeaderController.generateContent(includeDrawerIcon)
        .then((headerContent) => {
            return this.navigationView.navigateToUrl(
                url, headerContent, {navigationHandler});
        })
        .then(() => {
            return this.navigationHeaderController.setTitle();
        });
};

NavigationController.prototype.navigateMainViewToNewRoot = function(url, title) {
    this.popToRoot({animated: true})
        .then(() => {
            return this.navigationView.getTopPlugin();
        })
        .then((rootWebView) => {
            this.navigationHeaderController.setTitle(title);
            if (typeof rootWebView.navigate === 'function') {
                return rootWebView.navigate(url);
            } else {
                // Note: this code branch is untested
                // This would be used if the root plugin is not a WebViewPlugin.
                // In that case, we want to tell the navigation plugin to navigate instead.
                return this.navigate(url, true);
            }
        });
};

NavigationController.prototype.popToRoot = function(params) {
    return this.navigationView.popToRoot(params);
};

NavigationController.prototype.back = function() {
    this.navigationView.canGoBack().then((canGoBack) => {
        if (canGoBack) {
            this.navigationView.back();
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

export default NavigationController;

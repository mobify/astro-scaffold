import Promise from 'bluebird';
import TabBarPlugin from 'astro/plugins/tabBarPlugin';
import TabConfig from '../app-config/tabConfig';
import NavigationController from './navigationController';

const TabBarController = function(tabBar, layout) {
    this.tabBar = tabBar;
    this.viewPlugin = layout;
    this.activeTabId = null;

    // Set up regular tabs' layouts
    this._tabViews = {};
    this._navigationControllers = {};

    this.tabBar.setOpaque();

    // Needs to happen before tabBar is set up so we can receive the first itemSelect event
    this._bindEvents();
};

const initRegularTabs = function(
    controller,
    tabItems,
    cartEventHandler,
    counterBadgeController,
    errorController
) {
    // Make sure all tabViews are set up
    return Promise.all(tabItems.map((tab) => {
        // Init a new NavigationController
        const navigationControllerPromise = NavigationController.init(
            tab.id,
            tab.url,
            counterBadgeController,
            cartEventHandler,
            errorController
        );
        return navigationControllerPromise.then((navigationController) => {
            controller._navigationControllers[tab.id] = navigationController;
            controller._tabViews[tab.id] = navigationController.viewPlugin;
        });
    })).then(() => {
        controller.tabBar.setItems(tabItems);
        return controller;
    });
};

TabBarController.init = async function(
    layout,
    cartEventHandler,
    counterBadgeController,
    errorController
) {
    const tabBar = await TabBarPlugin.init();

    const controller = new TabBarController(tabBar, layout);
    return initRegularTabs(
        controller,
        TabConfig.tabItems,
        cartEventHandler,
        counterBadgeController,
        errorController
    );
};

TabBarController.prototype.selectTab = function(tabId) {
    return this.tabBar.selectItem(tabId);
};

TabBarController.prototype._selectTabHandler = function(tabId) {
    if (this.activeTabId !== tabId) {
        // activeTabId is undefined during startup
        if (this.activeTabId) {
            this.getActiveNavigationView().isActive = false;
        }

        this.viewPlugin.setContentView(this._tabViews[tabId]);
        this.activeTabId = tabId;

        const selectedTab = this.getActiveNavigationView();
        selectedTab.isActive = true;

        if (selectedTab.needsReload()) {
            const selectedNavigationView = selectedTab.navigationView;
            Promise.join(
                selectedNavigationView.canGoBack(),
                selectedNavigationView.getTopPlugin(),
                (tabCanGoBack, topPlugin) => {
                    // In the case where a tab failed its initial navigation
                    // a reload is insufficient so instead, we navigate to
                    // the tab's root URL.
                    if (!tabCanGoBack && typeof topPlugin.navigate === 'function') {
                        const tabItem = TabConfig.tabItems[tabId - 1];
                        topPlugin.navigate(tabItem.url);
                    } else {
                        topPlugin.reload();
                    }
                    selectedNavigationView.loaded = true;
                }
            );
        }
    } else {
        this.getActiveNavigationView().popToRoot({animated: true});
    }
};

TabBarController.prototype.getActiveNavigationView = function() {
    return this._navigationControllers[this.activeTabId];
};

TabBarController.prototype._bindEvents = function() {
    // Select Tab
    this.tabBar.on('itemSelect', (data) => this._selectTabHandler(data.id));
};

TabBarController.prototype.navigateActiveItem = function(url) {
    return this.getActiveNavigationView().navigate(url);
};

TabBarController.prototype.backActiveItem = function() {
    if (this.canGoBack()) {
        const activeTab = this.getActiveNavigationView();
        activeTab.back();
    }
};

TabBarController.prototype.canGoBack = function() {
    const activeTab = this.getActiveNavigationView();
    return activeTab.canGoBack();
};

export default TabBarController;

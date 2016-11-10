define([
    'bluebird',
    'config/baseConfig',
    'config/segmentsConfig',
    'plugins/anchoredLayoutPlugin',
    'plugins/segmentedPlugin'
],
function(
    Promise,
    BaseConfig,
    SegmentsConfig,
    AnchoredLayoutPlugin,
    SegmentedPlugin
) {
    var SegmentedController = function(layout, navigationView, urlMap) {
        this.parentLayout = layout;
        this.navigationView = navigationView;
        this.urlMap = urlMap;
        this.currentSegments = null;
        this._registerEvents();
    };

    SegmentedController.init = function(layoutPromise, navigationViewPromise) {
        var urlMap = {};
        return Promise.join(
            layoutPromise,
            navigationViewPromise,
            function(layout, navigationView) {
                return Promise.all(
                    SegmentsConfig.map(function(page, _) {
                        return SegmentedPlugin.init().then(function(segmentedControl) {
                            segmentedControl.setColor(BaseConfig.colors.primaryColor);
                            segmentedControl.setItems(page.items);
                            segmentedControl.on('itemSelect', function(params) {
                                navigationView.trigger('segmented:' + params.key);
                            });
                            layout.addTopView(segmentedControl, {
                                animated: false,
                                visible: false
                            });
                            urlMap[page.url] = segmentedControl;
                        });
                    })
                ).then(function() {
                    return new SegmentedController(layout, navigationView, urlMap);
                });
            }
        );
    };

    SegmentedController.prototype.showSegmentsForUrl = function(url) {
        var self = this;
        if (self.currentSegments) {
            self.parentLayout.hideView(this.currentSegments);
        }
        var urlObject = new URL(url);
        var segments = self._getSegmentsByUrl(url);
        if (segments) {
            self.parentLayout.showView(segments, {animated: false});
            self.currentSegments = segments;
            // Must re-trigger the currently selected segment for
            // client-side js to run again
            self.currentSegments.getSelectedItem().then(function(key) {
                self.navigationView.trigger('segmented:' + key);
            });
        }
    };

    SegmentedController.prototype._getSegmentsByUrl = function(url) {
        var urlObject = new URL(url);
        if (urlObject.pathname in this.urlMap) {
            return this.urlMap[urlObject.pathname];
        } else if (urlObject.pathname.slice(0, -1) in this.urlMap) {
            return this.urlMap[urlObject.pathname.slice(0, -1)];
        } else {
            return false;
        }
    };

    SegmentedController.prototype._registerEvents = function() {
        var self = this;
        this.navigationView.on('back', function(params) {
            self.showSegmentsForUrl(params.url);
        });
        this.navigationView.on('segmented:reload', function(params) {
            self.showSegmentsForUrl(params.url);
        });
    };

    return SegmentedController;
});

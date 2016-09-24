define([
    'bluebird',
    'plugins/anchoredLayoutPlugin',
    'plugins/segmentedPlugin',
    'config/baseConfig',
    'config/segmentsConfig'
],
function(
    Promise,
    AnchoredLayoutPlugin,
    SegmentedPlugin,
    BaseConfig,
    SegmentsConfig
) {
    var SegmentedController = function(layout, navigationView, config, urlMap) {
        this.parentLayout = layout;
        this.navigationView = navigationView;
        this.config = config;
        this.urlMap = urlMap;
        this.currentSegments = null;
        this.registerEvents();
    };

    SegmentedController.init = function(layoutPromise, navigationViewPromise) {
        var urlMap = {};
        return Promise.join(
            layoutPromise,
            navigationViewPromise,
            function(layout, navigationView) {
                return Promise.all(
                    SegmentsConfig.map(function(page, _) {
                        return SegmentedPlugin.init().then(function(segmentedControls) {
                            segmentedControls.setColor(BaseConfig.colors.primaryColor);
                            segmentedControls.setItems(page.items);
                            layout.addTopView(segmentedControls, {height: 44});
                            layout.hideView(segmentedControls, {animated: false});
                            urlMap[page.url] = segmentedControls;
                        });
                    })
                ).then(function() {
                    return new SegmentedController(layout, navigationView, SegmentsConfig, urlMap);
                });
            }
        );
    };

    SegmentedController.prototype.loadSegments = function(url) {
        if (this.currentSegments) {
            this.parentLayout.hideView(this.currentSegments);
        }
        var urlObject = new URL(url);
        var segments = this.getSegmentsByUrl(url);
        if (segments) {
            this.parentLayout.showView(segments, {animated: false});
            this.currentSegments = segments;
        }
    };

    SegmentedController.prototype.getSegmentsByUrl = function(url) {
        var urlObject = new URL(url);
        if (urlObject.pathname in this.urlMap) {
            return this.urlMap[urlObject.pathname];
        } else if (urlObject.pathname.slice(0, -1) in this.urlMap) {
            return this.urlMap[urlObject.pathname.slice(0, -1)];
        } else {
            return false;
        }
    };

    SegmentedController.prototype.registerEvents = function() {
        var self = this;
        this.navigationView.on('back', function(params) {
            self.loadSegments(params.url);
        });
    };

    return SegmentedController;
});

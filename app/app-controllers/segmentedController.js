import Promise from 'bluebird';
import SegmentedPlugin from 'astro/plugins/segmentedPlugin';
import BaseConfig from '../app-config/baseConfig';
import SegmentsConfig from '../app-config/segmentsConfig';

const SegmentedController = function(layout, navigationView, urlMap) {
    this.parentLayout = layout;
    this.navigationView = navigationView;
    this.urlMap = urlMap;
    this.currentSegments = null;
    this._registerEvents();
};

SegmentedController.init = function(layoutPromise, navigationViewPromise) {
    const urlMap = {};
    return Promise.join(
        layoutPromise,
        navigationViewPromise,
        (layout, navigationView) => {
            return Promise.all(
                SegmentsConfig.map((page) => {
                    return SegmentedPlugin.init().then((segmentedControl) => {
                        segmentedControl.setColor(BaseConfig.colors.primaryColor);
                        segmentedControl.setItems(page.items);
                        // eslint-disable-next-line
                        segmentedControl.on('itemSelect', (params) => navigationView.trigger(`segmented:${params.key}`));
                        layout.addTopView(segmentedControl, {
                            animated: false,
                            visible: false
                        });
                        urlMap[page.url] = segmentedControl;
                    });
                })
            ).then(() => {
                return new SegmentedController(layout, navigationView, urlMap);
            });
        }
    );
};

SegmentedController.prototype.showSegmentsForUrl = function(url) {
    if (this.currentSegments) {
        this.parentLayout.hideView(this.currentSegments);
    }
    const segments = this._getSegmentsByUrl(url);
    if (segments) {
        this.parentLayout.showView(segments, {animated: false});
        this.currentSegments = segments;
        // Must re-trigger the currently selected segment for
        // client-side js to run again
        this.currentSegments.getSelectedItem().then((key) => {
            this.navigationView.trigger(`segmented:${key}`);
        });
    }
};

SegmentedController.prototype._getSegmentsByUrl = function(url) {
    const urlObject = new URL(url);
    if (urlObject.pathname in this.urlMap) {
        return this.urlMap[urlObject.pathname];
    } else if (urlObject.pathname.slice(0, -1) in this.urlMap) {
        return this.urlMap[urlObject.pathname.slice(0, -1)];
    } else {
        return false;
    }
};

SegmentedController.prototype._registerEvents = function() {
    this.navigationView.on('back', (params) => this.showSegmentsForUrl(params.url));
    this.navigationView.on('segmented:reload', (params) => this.showSegmentsForUrl(params.url));
};

export default SegmentedController;

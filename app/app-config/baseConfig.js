define([], function() {
/* eslint-enable max-statements */
    var baseURL = 'https://webpush-you-host.mobifydemo.io';
    var previewBundle = 'https://localhost:8443/adaptive.js';

    // Line altered by generator. If changing please change generator as well!!
    var useTabLayout = false;
    var useAppPreview = false;

    var colors = {
        primaryColor: '#007ba7',
        secondaryColor: '#007ba7',
        whiteColor: '#ffffff'
    };

    var loaderColor = colors.primaryColor;

    return {
        baseURL: baseURL,
        colors: colors,
        loaderColor: loaderColor,
        previewBundle: previewBundle,
        useAppPreview: useAppPreview,
        useTabLayout: useTabLayout
    };
});

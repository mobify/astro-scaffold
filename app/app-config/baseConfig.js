define([], function() {
/* eslint-enable max-statements */


    var baseURL = 'https://webpush-you-host.mobifydemo.io';

    // Obtainable from iTunes Connect
    var appId = '';

    // Line altered by generator. If changing please change generator as well!!
    var iosUsingTabLayout = false;

    var colors = {
        primaryColor: '#007ba7',
        secondaryColor: '#007ba7',
        whiteColor: '#ffffff'
    };

    var loaderColor = colors.primaryColor;

    return {
        appId: appId,
        baseURL: baseURL,
        colors: colors,
        iosUsingTabLayout: iosUsingTabLayout,
        loaderColor: loaderColor
    };
});

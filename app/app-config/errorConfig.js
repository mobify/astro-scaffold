define([], function() {
/* eslint-enable max-statements */

    var url = 'file:///app-www/html/error.html';

    // Define/modify content for displayed error screens belonging to triggered
    // errors. Triggered errors are watched for in `errorController.js`.

    // Note: The keys in the error object must match the key of the triggered
    //       error. For instance, the `noInternetConnection` trigger is watched,
    //       thus `noInternetConnection` is the key for defining content.
    var errors = {
        noInternetConnection: {
            title: 'Connectivity Title',
            message: 'To configure the contents of this error screen, \
                     modify the app-config/errorConfig.js file.',
            imageUrl: '../assets/error__image.png'
        },

        pageTimeout: {
            title: 'Timeout Title',
            message: 'To configure the contents of this error screen, \
                     modify the app-config/errorConfig.js file.',
            imageUrl: '../assets/error__image.png'
        }
    };

    return {
        url : url,
        errors: errors
    };
});

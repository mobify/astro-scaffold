define([], function() {
/* eslint-enable max-statements */

    var url = 'file:///scaffold-www/error-view/error.html';

    var errors = {
        noInternetConnection: {
            title: 'Connectivity Title',
            message: 'To configure the contents of this error screen, \
                     modify the scaffold-config/errorConfig.js file.',
            imageUrl: 'stub__image.png'
        },

        pageTimeout: {
            title: 'Timeout Title',
            message: 'To configure the contents of this error screen, \
                     modify the scaffold-config/errorConfig.js file.',
            imageUrl: 'stub__image.png'
        }
    };

    return {
        url : url,
        errors: errors
    };
});

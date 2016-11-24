var url = 'file:///app-www/html/error.html';

// Define/modify content for displayed error screens belonging to triggered
// errors. Triggered errors are watched for in `errorController.js`.

// Note:
//     - The keys in the error object must match the key of the triggered
//       error. For instance, the `noInternetConnection` trigger is watched,
//       thus `noInternetConnection` is the key for defining content.
//
//     - The value for the `imgSrc` key should be relative to `app-www/html/`
var errors = {
    noInternetConnection: {
        title: 'Connectivity Title',
        text: 'To configure the contents of this error screen, \
                 modify the app-config/errorConfig.js file.',
        imgSrc: '../assets/error__offline.png'
    },

    pageTimeout: {
        title: 'Timeout Title',
        text: 'To configure the contents of this error screen, \
                 modify the app-config/errorConfig.js file.',
        imgSrc: '../assets/error__timeout.png'
    }
};

module.exports = {
    url : url,
    errors: errors
};

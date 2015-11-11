require.config({
    baseUrl: '',
    paths: {
        'text': 'vendor/js/text',
        '$': 'vendor/js/zepto',
        'velocity': 'vendor/js/velocity',
        'plugin': 'vendor/js/plugin',
        'navitron': 'vendor/js/navitron'
    },
    'shim': {
        '$': {
            exports: '$'
        }
    }
});

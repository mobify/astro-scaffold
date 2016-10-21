require.config({
    baseUrl: '../js/build',
    deps: ['../global'],
    paths: {
        '$': 'jquery.min',
        'velocity': 'velocity.min',
        'navitron': 'navitron.min',
        'plugin': 'plugin.min'
    },
    'shim': {
        '$': {
            exports: '$'
        }
    }
});

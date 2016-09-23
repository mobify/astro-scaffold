require.config({
    baseUrl: '../js',
    deps: ['global'],
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

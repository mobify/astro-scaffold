require.config({
    baseUrl: '../js',
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

require.config({
    baseUrl: '../js',
    paths: {
        '$': 'zepto.min',
        'velocity': 'velocity.min',
        'navitron': 'navitron.min'
    },
    'shim': {
        '$': {
            exports: '$'
        }
    }
});

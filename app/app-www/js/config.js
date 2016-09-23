require.config({
    baseUrl: '../js',
    deps: ['global'],
    paths: {
        '$': 'build/jquery.min',
        'velocity': 'build/velocity.min',
        'navitron': 'build/navitron.min',
        'plugin': 'build/plugin.min'
    },
    'shim': {
        '$': {
            exports: '$'
        }
    }
});

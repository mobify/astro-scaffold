require.config({
    baseUrl: '../js',
    paths: {
        '$': 'zepto.min',
        'menuConfig': '../../scaffold-config/menuConfig',
        'velocity': 'velocity.min',
        'navitron': 'navitron.min'
    },
    'shim': {
        '$': {
            exports: '$'
        }
    }
});

require.config({
    baseUrl: '../js',
    paths: {
        '$': 'zepto.min',
        'leftMenuConfig': '../../scaffold-config/leftMenuConfig',
        'velocity': 'velocity.min',
        'navitron': 'navitron.min'
    },
    'shim': {
        '$': {
            exports: '$'
        }
    }
});

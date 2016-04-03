require.config({
    baseUrl: '../../../',
    paths: {
        '$': 'node_modules/jquery/dist/jquery.min',
        'bluebird': 'node_modules/bluebird/js/browser/bluebird',
        'velocity': 'node_modules/velocity-animate/velocity.min',
        'navitron': 'node_modules/navitron/dist/navitron.min',
        'plugin': 'node_modules/plugin/dist/plugin.min',
        'requirejs': 'node_modules/requirejs/require',
        'astro-client': 'node_modules/astro-sdk/js/src/astro-client',
        'astro-base': 'node_modules/astro-sdk/js/src/astro-base',
        'astro-full': 'node_modules/astro-sdk/js/src/astro-full',
        'astro-rpc': 'node_modules/astro-sdk/js/src/global/astro-rpc',
        'left-drawer': 'app/scaffold-www/js/left-drawer',
        'ui-config': 'app/scaffold-www/js/ui-config'
    },
    'shim': {
        '$': {
            exports: '$'
        }
    }
});

require.config({
    baseUrl: '.',
    paths: {
        '$': '../node_modules/jquery/dist/jquery.min',
        'astro-base': '../node_modules/astro-sdk/js/src/astro-base',
        'astro-client': '../node_modules/astro-sdk/js/src/astro-client',
        'astro-full': '../node_modules/astro-sdk/js/src/astro-full',
        'astro-rpc': '../node_modules/astro-sdk/js/src/global/astro-rpc',
        'app-events': 'global/app-events',
        'app-rpc': 'global/app-rpc',
        'application': '../node_modules/astro-sdk/js/src/application',
        'bluebird': '../node_modules/bluebird/js/browser/bluebird',
        'config': 'scaffold-config',
        'controllers': '../node_modules/astro-sdk/js/src/controllers',
        'left-drawer': './scaffold-www/js/left-drawer',
        'navitron': '../node_modules/navitron/dist/navitron.min',
        'plugin': '../node_modules/plugin/dist/plugin.min',
        'plugins': '../node_modules/astro-sdk/js/src/plugins',
        'plugin-manager': '../node_modules/astro-sdk/js/src/plugin-manager',
        'requirejs': 'node_modules/requirejs/require',
        'ui': './scaffold-www/js/ui',
        'velocity': '../node_modules/velocity-animate/velocity.min',
        'vendor/backbone-events': '../node_modules/astro-sdk/js/vendor/backbone-events',
        'worker': '../node_modules/astro-sdk/js/src/worker'
    },
    'shim': {
        '$': {
            exports: '$'
        }
    }
});

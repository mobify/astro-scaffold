require.config({
    baseUrl: '.',
    paths: {
    	'astro': '../node_modules/astro-sdk/js/src/astro',
        'app': '../node_modules/astro-sdk/js/src/app',
        'bluebird': 'node_modules/bluebird/js/browser/bluebird',
    	'plugins': '../node_modules/astro-sdk/js/src/plugins',
    	'plugin-manager': '../node_modules/astro-sdk/js/src/plugin-manager',
    	'vendor/backbone-events': '../node_modules/astro-sdk/js/vendor/backbone-events',
        'worker': '../node_modules/astro-sdk/js/src/worker'
    }
});

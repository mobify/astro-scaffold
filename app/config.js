require.config({
    baseUrl: '.',
    paths: {
        'astro': '../node_modules/astro-sdk/js/src/astro',
        'application': '../node_modules/astro-sdk/js/src/application',
        'worker': '../node_modules/astro-sdk/js/src/worker',
    	'plugin-manager': '../node_modules/astro-sdk/js/src/plugin-manager',
    	'plugins': '../node_modules/astro-sdk/js/src/plugins',
    	'vendor/backbone-events': '../node_modules/astro-sdk/js/vendor/backbone-events',
        'bluebird': 'node_modules/bluebird/js/browser/bluebird'
    }
});

define(['astro-full', 'plugin-manager'], function(Astro, PluginManager) {
    /**
     * CounterBadgePlugin
     */
    return (function() {
        /**
        * Constructor
        */
        var CounterBadgePlugin = function() {};

        /**
        * Defines the plugin name, which is necessary for
        * initialization of the plugin on the native side.
        */
        CounterBadgePlugin.pluginName = 'CounterBadgePlugin';

        CounterBadgePlugin.init = function(callback) {
            return PluginManager.createPlugin(CounterBadgePlugin, callback);
        };

        /**
        * Set the image path for the counter badge
        */
        CounterBadgePlugin.prototype.setImagePath = Astro.nativeRpcMethod('setImagePath', ['path']);

        /**
        * Set the counter text for the counter badge
        */
        CounterBadgePlugin.prototype.setCount = Astro.nativeRpcMethod('setCount', ['count']);

        /**
        * Set the counter badge background color
        */
        CounterBadgePlugin.prototype.setBackgroundColor = Astro.nativeRpcMethod('setBackgroundColor', ['color']);

        /**
        * Set the counter badge text color
        */
        CounterBadgePlugin.prototype.setTextColor = Astro.nativeRpcMethod('setTextColor', ['color']);

        return  CounterBadgePlugin;

    })();
});

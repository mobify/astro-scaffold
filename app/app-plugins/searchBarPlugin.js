define([
    'astro-full',
    'plugin-manager'
],
function(
    Astro,
    PluginManager
) {
    /**
    * Constructor
    */
    var SearchBarPlugin = function() {};

    /**
    * Defines the plugin name, which is necessary for
    * initialization of the plugin on the native side.
    */
    SearchBarPlugin.pluginName = 'SearchBarPlugin';

    SearchBarPlugin.init = function(callback) {
        return PluginManager.createPlugin(SearchBarPlugin, callback);
    };

    /**
    * Search field should loose focus (hide keyboard)
    */
    SearchBarPlugin.prototype.blur = Astro.nativeRpcMethod('blur', []);

     /**
    * Search field should receive focus (show keyboard)
    */
    SearchBarPlugin.prototype.focus = Astro.nativeRpcMethod('focus', []);

    /**
    * Set text into the search field
    */
    SearchBarPlugin.prototype.setText = Astro.nativeRpcMethod('setText', ['text']);

    return  SearchBarPlugin;
});

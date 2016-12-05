import Astro from 'astro/astro-full';
import PluginManager from 'astro/plugin-manager';

/**
* Constructor
*/
var DoubleIconsPlugin = function() {};

/**
* Defines the plugin name, which is necessary for
* initialization of the plugin on the native side.
*/
DoubleIconsPlugin.pluginName = 'DoubleIconsPlugin';

DoubleIconsPlugin.init = function(callback) {
    return PluginManager.createPlugin(DoubleIconsPlugin, callback);
};

DoubleIconsPlugin.prototype.setLeftIcon = Astro.nativeRpcMethod('setLeftIcon', ['address']);
DoubleIconsPlugin.prototype.setRightIcon = Astro.nativeRpcMethod('setRightIcon', ['address']);

module.exports = DoubleIconsPlugin;

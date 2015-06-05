package com.mobify.astro.scaffold;

import android.os.Bundle;

import com.mobify.astro.AstroActivity;
import com.mobify.astro.plugins.AnimationPlugin;
import com.mobify.astro.plugins.AnchoredLayoutPlugin;
import com.mobify.astro.plugins.AstroWorker;
import com.mobify.astro.plugins.loaders.DefaultLoaderPlugin;
import com.mobify.astro.plugins.loaders.FourDotsLoaderPlugin;
import com.mobify.astro.plugins.ImageViewPlugin;
import com.mobify.astro.plugins.HeaderBarPlugin;
import com.mobify.astro.plugins.ModalViewPlugin;
import com.mobify.astro.plugins.webviewplugin.WebViewPlugin;
import com.mobify.astro.plugins.DeviceNetworkPlugin;
import com.mobify.astro.plugins.DrawerPlugin;

import org.apache.cordova.CordovaWebView;

public class MainActivity extends AstroActivity {
    protected AstroWorker worker;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Register plugins.
        // TODO: In the future we probably want to load this from a configuration file.
        pluginManager.register(DeviceNetworkPlugin.class);
        pluginManager.register(DrawerPlugin.class);
        pluginManager.register(WebViewPlugin.class);
        pluginManager.register(AnchoredLayoutPlugin.class);
        pluginManager.register(ModalViewPlugin.class);
        pluginManager.register(HeaderBarPlugin.class);
        pluginManager.register(AnimationPlugin.class);
        pluginManager.register(ImageViewPlugin.class);
        pluginManager.register(DefaultLoaderPlugin.class);
        pluginManager.register(FourDotsLoaderPlugin.class);

        // Create the initial worker.
        worker = new AstroWorker(this);

        // Enable Cordova plugins by associating the worker's Cordova webview with the activity.
        CordovaWebView webView = (CordovaWebView)worker.getView();
        setCordovaWebView(webView);
    }
}

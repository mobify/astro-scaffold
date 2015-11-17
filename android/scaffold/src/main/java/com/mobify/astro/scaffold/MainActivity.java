package com.mobify.astro.scaffold;

import android.os.Bundle;

import com.mobify.astro.AstroActivity;
import com.mobify.astro.plugins.*;
import com.mobify.astro.plugins.loaders.*;
import com.mobify.astro.plugins.headerbarplugin.HeaderBarPlugin;
import com.mobify.astro.plugins.webviewplugin.WebViewPlugin;

import org.apache.cordova.CordovaWebView;

public class MainActivity extends AstroActivity {
    protected AstroWorker worker;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Register plugins.
        pluginManager.register(DrawerPlugin.class);
        pluginManager.register(WebViewPlugin.class);
        pluginManager.register(NavigationPlugin.class);
        pluginManager.register(AnchoredLayoutPlugin.class);
        pluginManager.register(ModalViewPlugin.class);
        pluginManager.register(HeaderBarPlugin.class);
        pluginManager.register(ImageViewPlugin.class);
        pluginManager.register(DefaultLoaderPlugin.class);
        pluginManager.register(TabBarPlugin.class);

        // Create the initial worker.
        worker = new AstroWorker(this, pluginManager);

        // Enable Cordova plugins by associating the worker's Cordova webview with the activity.
        CordovaWebView webView = (CordovaWebView)worker.getView();
        setCordovaWebView(webView);
    }
}

package com.mobify.astro.scaffold;

import android.os.Bundle;

import com.mobify.astro.AstroActivity;
import com.mobify.astro.AstroWorker;
import com.mobify.astro.plugins.AnchoredLayoutPlugin;
import com.mobify.astro.plugins.HeaderBarPlugin;
import com.mobify.astro.plugins.ModalViewPlugin;
import com.mobify.astro.plugins.SplashScreenPlugin;
import com.mobify.astro.plugins.webviewplugin.WebViewPlugin;
import com.mobify.astro.plugins.DeviceNetworkPlugin;
import com.mobify.astro.plugins.DrawerPlugin;

import org.apache.cordova.CordovaWebView;

public class MainActivity extends AstroActivity {
    protected AstroWorkerPlugin worker;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Register plugins.
        // TODO: In the future we probably want to load this from a configuration file.
        pluginManager.register(DeviceNetworkPlugin.class);
        pluginManager.register(DrawerPlugin.class);
        pluginManager.register(WebViewPlugin.class);
        pluginManager.register(AnchoredLayoutPlugin.class);
        pluginManager.register(SplashScreenPlugin.class);
        pluginManager.register(ModalViewPlugin.class);
        pluginManager.register(HeaderBarPlugin.class);

        // Create the initial worker.
        worker = new AstroWorker(this);

        // Enable Cordova plugins by associating the worker's Cordova webview with the activity.
        CordovaWebView webView = (CordovaWebView)worker.getView();
        setCordovaWebView(webView);
    }
}

package com.mobify.astro.scaffold;

import android.os.Bundle;

import com.mobify.astro.AstroActivity;
import com.mobify.astro.plugins.*;
import com.mobify.astro.plugins.counterbadgeplugin.CounterBadgePlugin;
import com.mobify.astro.plugins.loaders.*;
import com.mobify.astro.plugins.headerbarplugin.HeaderBarPlugin;
import com.mobify.astro.plugins.webviewplugin.WebViewPlugin;
import com.mobify.astro.scaffold.plugins.DoubleIconsPlugin;
import com.mobify.astro.scaffold.plugins.SearchBarPlugin;

import org.apache.cordova.CordovaWebView;

public class MainActivity extends AstroActivity {
    protected AstroWorker worker;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Create the initial worker.
        worker = new AstroWorker(this, pluginManager);
    }
}

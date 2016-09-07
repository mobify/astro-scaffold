package com.mobify.astro.scaffold.plugins;

import android.view.View;
import android.widget.SearchView;

import com.mobify.astro.AstroActivity;
import com.mobify.astro.AstroPlugin;
import com.mobify.astro.PluginResolver;
import com.mobify.astro.messaging.annotations.RpcMethod;
import com.mobify.astro.utilities.LocaleChangedListener;
import com.mobify.astro.utilities.LocalizationUtilities;

import org.json.JSONException;
import org.json.JSONObject;


public class SearchBarPlugin extends AstroPlugin implements LocaleChangedListener {

    static final String TAG = SearchBarPlugin.class.getName();

    private SearchView searchView;

    public SearchBarPlugin(AstroActivity activity, PluginResolver pluginResolver) {
        super(activity, pluginResolver);
        activity.getLocalizationUtilities().addLocaleChangedListener(this);

        searchView = new SearchView(activity);
        setLocalizedText();
        searchView.setOnQueryTextListener(new SearchView.OnQueryTextListener() {
            @Override
            public boolean onQueryTextSubmit(String query) {
                JSONObject searchSubmittedParams = new JSONObject();
                try {
                    searchSubmittedParams.put("searchTerms", query);
                } catch (JSONException e) {
                    e.printStackTrace();
                }
                triggerEvent("search:submitted", searchSubmittedParams);
                return true;
            }

            @Override
            public boolean onQueryTextChange(String newText) {
                return false;
            }
        });
        searchView.setOnCloseListener(new SearchView.OnCloseListener() {
            @Override
            public boolean onClose() {
                triggerEvent("search:cancelled", null);
                return false;
            }
        });
    }

    private void setLocalizedText() {
        LocalizationUtilities localizationUtilities = activity.getLocalizationUtilities();
        searchView.setQueryHint(localizationUtilities.translate("search_bar_hint"));
    }

    @Override
    public View getView() {
        return searchView;
    }

    @RpcMethod(methodName = "blur")
    public void blur() {
        searchView.setIconified(true);
    }

    @RpcMethod(methodName = "focus")
    public void focus() {
        searchView.setIconified(false);
    }

    @RpcMethod(methodName = "setText", parameterNames = {"text"})
    public void setText(String text) {
        searchView.setQuery(text, false);
    }

    @Override
    public void localeDidChange() {
        setLocalizedText();
        if (activity.getLocalizationUtilities().leftToRight()) {
            searchView.setLayoutDirection(View.LAYOUT_DIRECTION_LTR);
        } else {
            searchView.setLayoutDirection(View.LAYOUT_DIRECTION_RTL);
        }
    }
}

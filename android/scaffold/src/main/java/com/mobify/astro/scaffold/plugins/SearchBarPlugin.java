package com.mobify.astro.scaffold.plugins;

import com.mobify.astro.AstroActivity;
import com.mobify.astro.AstroPlugin;
import com.mobify.astro.PluginResolver;
import com.mobify.astro.messaging.annotations.RpcMethod;
import com.mobify.astro.scaffold.R;

import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.Drawable;
import android.support.v4.content.ContextCompat;
import android.support.v4.content.res.ResourcesCompat;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.support.v7.widget.CardView;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by jason on 2016-05-09.
 */
public class SearchBarPlugin extends AstroPlugin {

    LinearLayout containerView;
    EditText textInput;
    Button cancelButton;

    public SearchBarPlugin(AstroActivity activity, PluginResolver pluginResolver) {
        super(activity, pluginResolver);

        setupTextInput();
        setupCancelButton();
        setupContainerView();
    }

    private void setupContainerView() {
        containerView = new LinearLayout(activity);
        containerView.setBackgroundColor(Color.parseColor("#E6E6E6"));
        int padding = activity.getResources().getDimensionPixelSize(R.dimen.search_card_margin);
        containerView.setPadding(padding, padding, padding, padding);
        LinearLayout.LayoutParams containerParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
        );
        containerView.setLayoutParams(containerParams);

        CardView card = new CardView(activity);
        card.setCardBackgroundColor(Color.parseColor("#FFFFFF"));
        card.setUseCompatPadding(true);
        card.setCardElevation(activity.getResources().getDimensionPixelSize(R.dimen.search_card_elevation));
        card.setMaxCardElevation(activity.getResources().getDimensionPixelSize(R.dimen.search_card_elevation));
        CardView.LayoutParams cardParams = new CardView.LayoutParams(
            CardView.LayoutParams.MATCH_PARENT, CardView.LayoutParams.WRAP_CONTENT
        );
        card.setLayoutParams(cardParams);

        LinearLayout innerView = new LinearLayout(activity);
        LinearLayout.LayoutParams innerParams = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
        );
        innerView.setLayoutParams(innerParams);

        // containerView.setBackgroundColor(ContextCompat.getColor(activity.getApplicationContext(), R.color.grey_95));
        // containerView.setBackground(ResourcesCompat.getDrawable(activity.getResources(), R.drawable.bottom_border, null));

        innerView.addView(textInput);
        innerView.addView(cancelButton);
        card.addView(innerView);
        containerView.addView(card);
    }

    private void setupTextInput() {
        textInput = new EditText(activity);
        setTextInputLayout();

        // Styling
        textInput.setGravity(Gravity.CENTER_VERTICAL);
        // textInput.setBackground(ResourcesCompat.getDrawable(activity.getResources(), R.drawable.rounded_edittext, null));
        // textInput.setHintTextColor(ContextCompat.getColor(activity.getApplicationContext(), R.color.grey_70));
        setTextInputPadding();

        // Search icon
        Drawable searchIcon = ResourcesCompat.getDrawable(activity.getResources(), R.drawable.icon__search, null);
        textInput.setCompoundDrawablePadding(activity.getResources().getDimensionPixelSize(R.dimen.search_bar_icon_right_padding));
        textInput.setCompoundDrawablesRelativeWithIntrinsicBounds(searchIcon, null, null, null);

        // Setup keyboard button to perform search instead of "enter"
        textInput.setImeOptions(EditorInfo.IME_ACTION_SEARCH);
        textInput.setSingleLine(true);
        textInput.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            @Override
            public boolean onEditorAction(TextView textView, int actionId, KeyEvent keyEvent) {
                boolean handled = false;
                if (actionId == EditorInfo.IME_ACTION_SEARCH) {
                    searchSubmitted(textView.getText().toString());
                    handled = true;
                }
                return handled;
            }
        });

        // Text
        textInput.setHint("Search");
    }

    private void setTextInputPadding() {
        textInput.setPadding(activity.getResources().getDimensionPixelSize(R.dimen.search_bar_left_padding), 0, textInput.getPaddingRight(), 0);
    }

    private void setTextInputLayout() {
        LinearLayout.LayoutParams textInputLayoutParams = new LinearLayout.LayoutParams(
                0, LinearLayout.LayoutParams.WRAP_CONTENT
        );
        textInputLayoutParams.weight = 1;
        int containerMargin = activity.getResources().getDimensionPixelSize(R.dimen.search_bar_plugin_outer_margin);
        textInputLayoutParams.setMargins(containerMargin, containerMargin, 0, containerMargin);
        textInput.setLayoutParams(textInputLayoutParams);
    }

    private void setupCancelButton() {
        cancelButton = new Button(activity);
        LinearLayout.LayoutParams cancelButtonLayoutParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
        );
        cancelButton.setLayoutParams(cancelButtonLayoutParams);
        cancelButton.setBackgroundColor(Color.TRANSPARENT);
        // cancelButton.setTextColor(ContextCompat.getColor(activity.getApplicationContext(), R.color.link_color));
        cancelButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                searchCancelled();
            }
        });

        cancelButton.setText("Cancel");
    }

    @Override
    public View getView() {
        return containerView;
    }

    @RpcMethod(methodName = "blur")
    public void blur() {
        activity.hideKeyboard();
    }

    @RpcMethod(methodName = "focus")
    public void focus() {
        textInput.requestFocus();
        InputMethodManager imm = (InputMethodManager) activity.getSystemService(Context.INPUT_METHOD_SERVICE);
        imm.showSoftInput(textInput, InputMethodManager.SHOW_IMPLICIT);
    }

    @RpcMethod(methodName = "setText", parameterNames = {"text"})
    public void setText(String text) {
        textInput.setText(text);
    }

    private void searchCancelled() {
        triggerEvent("search:cancelled", null);
    }

    private void searchSubmitted(String searchText) {
        JSONObject searchSubmittedParams = new JSONObject();
        try {
            searchSubmittedParams.put("searchTerms", searchText);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        triggerEvent("search:submitted", searchSubmittedParams);
    }
}

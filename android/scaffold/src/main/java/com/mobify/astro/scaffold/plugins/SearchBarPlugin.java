package com.mobify.astro.scaffold.plugins;

import android.content.Context;
import android.graphics.Color;
import android.graphics.PorterDuff;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.util.Log;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.ImageButton;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.FrameLayout;
import android.widget.TextView;
import android.support.v7.widget.CardView;

import com.mobify.astro.AstroActivity;
import com.mobify.astro.AstroPlugin;
import com.mobify.astro.PluginResolver;
import com.mobify.astro.scaffold.R;
import com.mobify.astro.messaging.annotations.RpcMethod;
import com.mobify.astro.utilities.DrawableUriResolver;
import com.mobify.astro.utilities.LocaleChangedListener;
import com.mobify.astro.utilities.LocalizationUtilities;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by jason on 2016-05-09.
 */
public class SearchBarPlugin extends AstroPlugin implements LocaleChangedListener {

    static final String TAG = SearchBarPlugin.class.getName();
    static final String BACK_BUTTON_URI = "file:///abc_ic_ab_back_mtrl_am_alpha";

    private FrameLayout containerView;
    private LinearLayout innerView;
    private EditText textInput;
    private ImageButton backButton;

    public SearchBarPlugin(AstroActivity activity, PluginResolver pluginResolver) {
        super(activity, pluginResolver);
        activity.getLocalizationUtilities().addLocaleChangedListener(this);

        // Setup main view container
        setupContainerView();
        // Setup a view to hold the input and cancel button
        setupInnerView();
        // Setup input and cancel button
        setupTextInput();
        setupBackButton();
        setLocalizedText();
        // Create a card view to sit in the middle for style
        CardView card = createCardView();
        // Put it all together
        innerView.addView(backButton);
        innerView.addView(textInput);
        card.addView(innerView);
        containerView.addView(card);
    }

    private void setupContainerView() {
        containerView = new FrameLayout(activity);
        containerView.setBackgroundColor(Color.parseColor("#E6E6E6"));
        int padding = activity.getResources().getDimensionPixelSize(R.dimen.search_card_margin);
        containerView.setPadding(padding, padding, padding, padding);
        FrameLayout.LayoutParams param = new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.WRAP_CONTENT
        );
        containerView.setLayoutParams(param);
    }


    private CardView createCardView() {
        CardView card = new CardView(activity);
        card.setCardBackgroundColor(Color.parseColor("#FFFFFF"));
        card.setUseCompatPadding(true);
        int leftRightPadding = activity.getResources().getDimensionPixelSize(R.dimen.search_card_padding_left_right);
        int topBottomPadding = activity.getResources().getDimensionPixelSize(R.dimen.search_card_padding_top_bottom);
        card.setContentPadding(leftRightPadding, topBottomPadding, leftRightPadding, topBottomPadding);
        card.setCardElevation(activity.getResources().getDimensionPixelSize(R.dimen.search_card_elevation));
        card.setMaxCardElevation(activity.getResources().getDimensionPixelSize(R.dimen.search_card_elevation));
        CardView.LayoutParams cardParams = new CardView.LayoutParams(
            CardView.LayoutParams.MATCH_PARENT, CardView.LayoutParams.WRAP_CONTENT
        );
        card.setLayoutParams(cardParams);
        return card;
    }

    private void setupInnerView() {
        innerView = new LinearLayout(activity);
        LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT
        );
        innerView.setLayoutParams(params);
        innerView.setLayoutDirection(View.LAYOUT_DIRECTION_LOCALE);
    }

    private void setupTextInput() {
        textInput = new EditText(activity);
        setTextInputLayout();

        // Styling
        textInput.setGravity(Gravity.CENTER_VERTICAL);
        // textInput.setBackground(ResourcesCompat.getDrawable(activity.getResources(), R.drawable.rounded_edittext, null));
        // textInput.setHintTextColor(ContextCompat.getColor(activity.getApplicationContext(), R.color.grey_70));

        textInput.setTextSize(TypedValue.COMPLEX_UNIT_PX , activity.getResources().getDimensionPixelSize(R.dimen.search_bar_text_size));

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
    }

    private void setTextInputLayout() {
        LinearLayout.LayoutParams textInputLayoutParams = new LinearLayout.LayoutParams(
                0, LinearLayout.LayoutParams.WRAP_CONTENT
        );
        textInputLayoutParams.weight = 1;
        int spacing = activity.getResources().getDimensionPixelSize(R.dimen.search_bar_spacing_between);
        if (activity.getLocalizationUtilities().leftToRight()) {
            textInputLayoutParams.setMargins(spacing, 0, 0, 0);
        } else {
            textInputLayoutParams.setMargins(0, 0, spacing, 0);
        }
        textInput.setLayoutParams(textInputLayoutParams);
    }

    private void setupBackButton() {
        backButton = new ImageButton(activity);
        LinearLayout.LayoutParams cancelButtonLayoutParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                LinearLayout.LayoutParams.MATCH_PARENT
        );
        backButton.setLayoutParams(cancelButtonLayoutParams);
        backButton.setBackgroundColor(Color.TRANSPARENT);
        DrawableUriResolver drawableResolver = new DrawableUriResolver(activity);
        try {
            Drawable backDrawable = drawableResolver.getLocalDrawable(Uri.parse(BACK_BUTTON_URI));
            backDrawable.setColorFilter(0xFF737373, PorterDuff.Mode.SRC_IN);
            backButton.setImageDrawable(backDrawable);
        } catch (Exception e) {
            Log.e(TAG, "Could not load back button drawable.", e);
        }
        backButton.setOnClickListener(new View.OnClickListener() {
            public void onClick(View v) {
                searchCancelled();
            }
        });
    }

    private void setLocalizedText() {
        LocalizationUtilities localizationUtilities = activity.getLocalizationUtilities();
        textInput.setHint(localizationUtilities.translate("search_bar_hint"));
        // button text goes all-caps by default...except on android 4.x
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
        textInput.getBackground().setColorFilter(0x00FFFFFF, PorterDuff.Mode.SRC_IN);
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

    @Override
    public void localeDidChange() {
        setLocalizedText();
        setTextInputLayout();
        if (activity.getLocalizationUtilities().leftToRight()) {
            innerView.setLayoutDirection(View.LAYOUT_DIRECTION_LTR);
        } else {
            innerView.setLayoutDirection(View.LAYOUT_DIRECTION_RTL);
        }
    }
}

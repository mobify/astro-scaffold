package com.mobify.astro.scaffold.plugins;

import com.mobify.astro.AstroActivity;
import com.mobify.astro.AstroPlugin;
import com.mobify.astro.PluginResolver;

import android.content.Context;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.widget.FrameLayout;
import android.widget.LinearLayout;

import com.mobify.astro.messaging.annotations.RpcMethod;
import com.mobify.astro.plugins.headerbarplugin.HeaderContentItem;
import com.mobify.astro.scaffold.R;

public class DoubleIconsPlugin extends AstroPlugin {

    public class DoubleIconItemView extends FrameLayout {
        View view = null;
        int contentGravity;
        String id = "";

        public DoubleIconItemView(Context context, int gravity) {
            super(context);
            this.contentGravity = gravity;
        }

        private void setPlugin(AstroPlugin plugin, String id) {
            if (view != plugin.getView()) {
                this.removeAllViews();

                FrameLayout.LayoutParams layoutParams = new FrameLayout.LayoutParams(
                        LayoutParams.WRAP_CONTENT,
                        LayoutParams.WRAP_CONTENT
                );
                layoutParams.gravity = contentGravity;

                this.addView(plugin.getView(), layoutParams);
                view = plugin.getView();
                this.id = id;
            }

            this.setVisibility(View.VISIBLE);
        }
    }

    LinearLayout containerView;
    DoubleIconItemView leftIcon;
    DoubleIconItemView rightIcon;

    class DoubleIconsItemClickListener implements View.OnClickListener {
        DoubleIconItemView doubleIconItemView;

        DoubleIconsItemClickListener(DoubleIconItemView doubleIconItemView) {
            this.doubleIconItemView = doubleIconItemView;
        }

        @Override
        public void onClick(View v) {
            triggerEvent(doubleIconItemView.id, null);
        }
    }

    public static int getActionBarHeight(AstroActivity activity) {
        // Try to get the action bar's height from the theme's resources.
        TypedValue actionBarSizeTypedValue = new TypedValue();
        if (activity.getTheme().resolveAttribute(
                android.R.attr.actionBarSize, actionBarSizeTypedValue, true))
        {
            return TypedValue.complexToDimensionPixelSize(
                    actionBarSizeTypedValue.data, activity.getResources().getDisplayMetrics()
            );
        }

        // Fallback to hardcoded, reasonable dips.
        return (int) activity.getResources().getDimension(com.mobify.astro.R.dimen.header_bar_fallback_height);
    }

    public DoubleIconsPlugin(AstroActivity activity, PluginResolver pluginResolver) {
        super(activity, pluginResolver);

        final int minItemSize = activity.getResources().getDimensionPixelSize(R.dimen.header_bar_item_min_size);

        LinearLayout.LayoutParams containerParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT, DoubleIconsPlugin.getActionBarHeight(activity)
        );
        containerParams.gravity = Gravity.CENTER;

        containerView = new LinearLayout(activity);
        containerView.setLayoutParams(containerParams);

        //endregion

        //region Left icon.

        LinearLayout.LayoutParams leftIconParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                minItemSize
        );
        leftIconParams.gravity = Gravity.CENTER;

        leftIcon = new DoubleIconItemView(activity, Gravity.CENTER);
        leftIcon.setLayoutParams(leftIconParams);
        leftIcon.setId(R.id.header_bar_left_item_id);
        leftIcon.setMinimumWidth(minItemSize);
        leftIcon.setOnClickListener(new DoubleIconsItemClickListener(leftIcon));

        //endregion

        //region Right icon.

        LinearLayout.LayoutParams rightIconParams = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.WRAP_CONTENT,
                minItemSize
        );
        rightIconParams.gravity = Gravity.CENTER;

        rightIcon = new DoubleIconItemView(activity, Gravity.CENTER);
        rightIcon.setLayoutParams(rightIconParams);
        rightIcon.setId(R.id.header_bar_right_item_id);
        rightIcon.setMinimumWidth(minItemSize);
        rightIcon.setOnClickListener(new DoubleIconsItemClickListener(rightIcon));

        //endregion

        containerView.addView(leftIcon);
        containerView.addView(rightIcon);
    }

    @Override
    public View getView() {
        return containerView;
    }

    @RpcMethod(methodName = "setLeftIcon", parameterNames = {"address"})
    public void setLeftIcon(String address) throws Exception {
        HeaderContentItem pluginDetails = HeaderContentItem.fromPlugin(pluginResolver, activity, "click:doubleIcons_left", address);
        leftIcon.setPlugin(pluginDetails.contentPlugin, pluginDetails.id);
    }

    @RpcMethod(methodName = "setRightIcon", parameterNames = {"address"})
    public void setRightIcon(String address) throws Exception {
        HeaderContentItem pluginDetails = HeaderContentItem.fromPlugin(pluginResolver, activity, "click:doubleIcons_right", address);
        rightIcon.setPlugin(pluginDetails.contentPlugin, pluginDetails.id);
    }

}
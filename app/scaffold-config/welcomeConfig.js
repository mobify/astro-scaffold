define(['config/baseConfig'], function(BaseConfig) {
/* eslint-enable max-statements */

    var url = 'file:///scaffold-www/welcome-view/welcome.html';

    var showHeader = false;

    var headerContent = {
        id : 'welcomeTitle_id',
        title: 'Welcome'
    };

    var closeIcon = {
        id : 'closeWelcomeScreen_id',
        imageUrl : 'file:///icon__close.png'
    };

    var colors = {
        textColor: BaseConfig.colors.whiteColor,
        backgroundColor: BaseConfig.colors.primaryColor
    };

    return {
        url : url,
        showHeader: showHeader,
        headerContent : headerContent,
        closeIcon : closeIcon,
        colors : colors
    };
});

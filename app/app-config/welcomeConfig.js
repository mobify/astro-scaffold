import BaseConfig from './baseConfig';

var url = 'file:///app-www/html/welcome.html';

var showHeader = false;

var headerContent = {
    id : 'welcomeTitle_id',
    title: 'Welcome'
};

var closeIcon = {
    id : 'closeWelcome_id',
    imageUrl : 'file:///icon__close.png'
};

var colors = {
    textColor: BaseConfig.colors.whiteColor,
    backgroundColor: BaseConfig.colors.primaryColor
};

module.exports = {
    url : url,
    showHeader: showHeader,
    headerContent : headerContent,
    closeIcon : closeIcon,
    colors : colors
};

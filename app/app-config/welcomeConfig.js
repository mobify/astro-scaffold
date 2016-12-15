import BaseConfig from './baseConfig';

const url = 'file:///app-www/html/welcome.html';

const showHeader = false;

const headerContent = {
    id: 'welcomeTitle_id',
    title: 'Welcome'
};

const closeIcon = {
    id: 'closeWelcome_id',
    imageUrl: 'file:///icon__close.png'
};

const colors = {
    textColor: BaseConfig.colors.whiteColor,
    backgroundColor: BaseConfig.colors.primaryColor
};

export default {
    url,
    showHeader,
    headerContent,
    closeIcon,
    colors
};

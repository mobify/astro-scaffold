import BaseConfig from './baseConfig';

var url = 'https://webpush-you-host.mobifydemo.io/cart/';

var headerContent = {
    id : 'cartTitle_id',
    title: 'Cart'
};

var closeIcon = {
    id : 'closeCart_id',
    imageUrl : 'file:///icon__close.png'
};

var colors = {
    textColor: BaseConfig.colors.whiteColor,
    backgroundColor: BaseConfig.colors.primaryColor
};

module.exports = {
    url : url,
    headerContent : headerContent,
    closeIcon : closeIcon,
    colors: colors
};

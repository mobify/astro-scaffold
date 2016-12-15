import BaseConfig from './baseConfig';

const url = 'https://webpush-you-host.mobifydemo.io/cart/';

const headerContent = {
    id: 'cartTitle_id',
    title: 'Cart'
};

const closeIcon = {
    id: 'closeCart_id',
    imageUrl: 'file:///icon__close.png'
};

const colors = {
    textColor: BaseConfig.colors.whiteColor,
    backgroundColor: BaseConfig.colors.primaryColor
};

export default {
    url,
    headerContent,
    closeIcon,
    colors
};

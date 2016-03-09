define(['config/baseConfig'], function(BaseConfig) {
/* eslint-enable max-statements */

    var cartHeaderContent = {
        id: 'cart_id',
        imageUrl: 'file:///icon__cart.png'
    };

    var drawerHeaderContent = {
        id: 'drawer_id',
        imageUrl: 'file:///icon__drawer.png'
    };

    var titleHeaderContent = {
        id: 'header_id',
        title: 'Velo'
    };

    var cartTitleHeaderContent = {
        id: 'cartTitle_id',
        title: 'Cart'
    };

    var colors = {
        textColor: BaseConfig.colors.whiteColor,
        backgroundColor: BaseConfig.colors.primaryColor
    };

    return {
        cartHeaderContent: cartHeaderContent,
        drawerHeaderContent: drawerHeaderContent,
        titleHeaderContent: titleHeaderContent,
        cartTitleHeaderContent: cartTitleHeaderContent,
        colors: colors
    };
});

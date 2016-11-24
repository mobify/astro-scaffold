import BaseConfig from './baseConfig';

var cartHeaderContent = {
    id: 'cart_id',
    imageUrl: 'file:///icon__cart.png'
};

var searchHeaderContent = {
    id: 'search_id',
    imageUrl: 'file:///icon__search.png'
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

var searchCartHeaderContent = {id: 'header__search_cart'};

var colors = {
    textColor: BaseConfig.colors.whiteColor,
    backgroundColor: BaseConfig.colors.primaryColor
};

module.exports = {
    cartHeaderContent: cartHeaderContent,
    searchHeaderContent: searchHeaderContent,
    drawerHeaderContent: drawerHeaderContent,
    titleHeaderContent: titleHeaderContent,
    cartTitleHeaderContent: cartTitleHeaderContent,
    searchCartHeaderContent: searchCartHeaderContent,
    colors: colors
};

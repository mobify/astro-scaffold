import BaseConfig from './baseConfig';

const cartHeaderContent = {
    id: 'cart_id',
    imageUrl: 'file:///icon__cart.png'
};

const searchHeaderContent = {
    id: 'search_id',
    imageUrl: 'file:///icon__search.png'
};

const drawerHeaderContent = {
    id: 'drawer_id',
    imageUrl: 'file:///icon__drawer.png'
};

const titleHeaderContent = {
    id: 'header_id',
    title: 'Velo'
};

const cartTitleHeaderContent = {
    id: 'cartTitle_id',
    title: 'Cart'
};

const searchCartHeaderContent = {id: 'header__search_cart'};

const colors = {
    textColor: BaseConfig.colors.whiteColor,
    backgroundColor: BaseConfig.colors.primaryColor
};

export default {
    cartHeaderContent,
    searchHeaderContent,
    drawerHeaderContent,
    titleHeaderContent,
    cartTitleHeaderContent,
    searchCartHeaderContent,
    colors
};

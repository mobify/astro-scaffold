define([ ], function() {
/* eslint-enable max-statements */

    var cartHeaderContent = {
        id: 'cart_id',
        imageUrl: 'file:///icon__cart.png'
    };

    var drawerHeaderContent = {
        id: 'drawer_id',
        imageUrl: 'file:///icon__drawer.png'
    };

    var closeHeaderContent = {
        id: 'close_id',
        imageUrl: 'file:///icon__close.png'
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
        textColor: '#ffffff',
        backgroundColor: '#007BA7'
    };

    return {
        cartHeaderContent: cartHeaderContent,
        drawerHeaderContent: drawerHeaderContent,
        closeHeaderContent: closeHeaderContent,
        titleHeaderContent: titleHeaderContent,
        cartTitleHeaderContent: cartTitleHeaderContent,
        colors: colors
    };
});

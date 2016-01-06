define([ ], function() {
/* eslint-enable max-statements */

    // Configure your menu items here:

    var menuItemOne = {
        id: '1',
        title:'Bikes',
        url: 'https://webpush-you-host.mobifydemo.io/',
        imageUrl: 'file:///Icon__discover.png',
        selectedImageUrl: 'file:///Icon__discover.png'
    };

    var menuItemTwo = {
        id: '2',
        title:'Accessories',
        url: 'https://webpush-you-host.mobifydemo.io/accessories/',
        imageUrl: 'file:///Icon__discover.png',
        selectedImageUrl: 'file:///Icon__discover.png'
    };

    var menuItemThree = {
        id: '3',
        title:'Services',
        url: 'https://webpush-you-host.mobifydemo.io/services/',
        imageUrl: 'file:///Icon__discover.png',
        selectedImageUrl: 'file:///Icon__discover.png'
    };

    var menuItemFour = {
        id: '4',
        title:'Sales',
        url: 'https://webpush-you-host.mobifydemo.io/sales/',
        imageUrl: 'file:///Icon__discover.png',
        selectedImageUrl: 'file:///Icon__discover.png'
    };

    var menuItemFive = {
        id: '5',
        title:'About',
        url: 'https://webpush-you-host.mobifydemo.io/about/',
        imageUrl: 'file:///Icon__discover.png',
        selectedImageUrl: 'file:///Icon__discover.png'
    };

    var menuItems = [
        menuItemOne,
        menuItemTwo,
        menuItemThree,
        menuItemFour,
        menuItemFive
    ];

    return {
        menuItems: menuItems
    };
});

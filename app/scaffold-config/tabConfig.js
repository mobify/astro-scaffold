define(['config/baseConfig'], function(BaseConfig) {
/* eslint-enable max-statements */

    // Configure your menu items here:
    var tabItemOne = {
        id: '1',
        title:'Bikes',
        url: BaseConfig.baseURL,
        imageUrl: 'file:///Icon__discover.png',
        selectedImageUrl: 'file:///Icon__discover.png'
    };

    var tabItemTwo = {
        id: '2',
        title:'Accessories',
        url: BaseConfig.baseURL + '/accessories',
        imageUrl: 'file:///Icon__discover.png',
        selectedImageUrl: 'file:///Icon__discover.png'
    };

    var tabItemThree = {
        id: '3',
        title:'Services',
        url: BaseConfig.baseURL + '/services',
        imageUrl: 'file:///Icon__discover.png',
        selectedImageUrl: 'file:///Icon__discover.png'
    };

    var tabItemFour = {
        id: '4',
        title:'Sales',
        url: BaseConfig.baseURL + '/sales',
        imageUrl: 'file:///Icon__discover.png',
        selectedImageUrl: 'file:///Icon__discover.png'
    };

    var tabItemFive = {
        id: '5',
        title:'About',
        url: BaseConfig.baseURL + '/about',
        imageUrl: 'file:///Icon__discover.png',
        selectedImageUrl: 'file:///Icon__discover.png'
    };

    var tabItems = [
        tabItemOne,
        tabItemTwo,
        tabItemThree,
        tabItemFour,
        tabItemFive
    ];

    return {
        tabItems: tabItems
    };
});

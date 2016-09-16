define(['config/baseConfig'], function(BaseConfig) {
/* eslint-enable max-statements */

    // Configure your tab bar items here:
    var tabItems = [
        {
            id: '1',
            title:'Bikes',
            url: BaseConfig.baseURL,
            imageUrl: 'file:///icon__discover.png',
            selectedImageUrl: 'file:///icon__discover.png'
        },
        {
            id: '2',
            title:'Accessories',
            url: BaseConfig.baseURL + '/accessories',
            imageUrl: 'file:///icon__discover.png',
            selectedImageUrl: 'file:///icon__discover.png'
        },
        {
            id: '3',
            title:'Services',
            url: BaseConfig.baseURL + '/services',
            imageUrl: 'file:///icon__discover.png',
            selectedImageUrl: 'file:///icon__discover.png'
        },
        {
            id: '4',
            title:'Sales',
            url: BaseConfig.baseURL + '/sales',
            imageUrl: 'file:///icon__discover.png',
            selectedImageUrl: 'file:///icon__discover.png'
        },
        {
            id: '5',
            title:'About',
            url: BaseConfig.baseURL + '/about',
            imageUrl: 'file:///icon__discover.png',
            selectedImageUrl: 'file:///icon__discover.png'
        }
    ];

    return {
        tabItems: tabItems
    };
});

define([], function() {

    // Configure your left drawer menu items here.
    // Providing a `subItems` key will allow multi-level menu navigation.
    //
    // ** Note: All leaf node items require an `href` key. The key value
    //          combined with the `baseURL` found in `baseConfig.js` will
    //          result in the complete URL used to navigate to the item.
    var menuItems = [
        {
            'title': 'Home',
            'href': '/'
        },
        {
            'title': 'Products',
            'subItems': [
                {
                    'title': 'Bikes',
                    'subItems': [
                        {
                            'title': 'Road Bike',
                            'href':  '/bikes/road-bike'
                        },
                        {
                            'title': 'City Bike',
                            'href': '/bikes/city-bike'
                        },
                        {
                            'title': 'Commuter',
                            'href': '/bikes/commuter'
                        },
                        {
                            'title': 'Fixie',
                            'href': '/bikes/fixie'
                        },
                        {
                            'title': 'Hybrid',
                            'href': '/bikes/hybrid'
                        },
                        {
                            'title': 'Mountain',
                            'href': '/bikes/mountain'
                        },
                    ]
                },
                {
                    'title': 'Accessories',
                    'href': '/accessories'
                }
            ]
        },
        {
            'title': 'Services',
            'href': '/services'
        },
        {
            'title': 'Sales',
            'href': '/sales'
        },
        {
            'title': 'About',
            'href': '/about'
        },
    ];

    return {
        menuItems: menuItems
    };
});

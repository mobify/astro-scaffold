define([], function() {

    var menuItems = [
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

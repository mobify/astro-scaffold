define([ ], function() {
/* eslint-enable max-statements */

    // Configure your tabs here:

    var tabOne = {
        id: '1',
        title:'Bikes',
        url: 'https://www.google.ca',
        imageUrl: 'file:///Icon__discover.png',
        selectedImageUrl: 'file:///Icon__discover.png'
    };

    var tabTwo = {
        id: '2',
        title:'Accessories',
        url: 'http://www.wired.com',
        imageUrl: 'file:///Icon__discover.png',
        selectedImageUrl: 'file:///Icon__discover.png'
    };

    var tabThree = {
        id: '3',
        title:'Services',
        url: 'http://www.wired.com',
        imageUrl: 'file:///Icon__discover.png',
        selectedImageUrl: 'file:///Icon__discover.png'
    };

    var tabFour = {
        id: '4',
        title:'Sales',
        url: 'http://www.yahoo.com',
        imageUrl: 'file:///Icon__discover.png',
        selectedImageUrl: 'file:///Icon__discover.png'
    };

    var tabFive = {
        id: '5',
        title:'About',
        url: 'https://www.thinkgeek.com',
        imageUrl: 'file:///Icon__discover.png',
        selectedImageUrl: 'file:///Icon__discover.png'
    };

    var tabItems = [
        tabOne,
        tabTwo,
        tabThree,
        tabFour,
        tabFive
    ];

    return {
        tabItems: tabItems
    };
});

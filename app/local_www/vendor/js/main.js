require(['config'], function() {
    require([
        '$',
        'velocity',
        'navitron'
    ],
    function($) {
        $('#myNavitron').navitron({
            structure: false,
            shiftAmount: 100
        });
    });
});

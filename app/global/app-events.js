define([
    'astro-full',
    'vendor/backbone-events'
], function(Astro, BackboneEvents) {
    var AppEvents = Astro.Utils.extend({}, BackboneEvents);

    // Dictionary of events raised by the application
    AppEvents.names = {
        // cart modal was displayed
        cartShown: 'cart:shown',

        // cart modal was hidden
        cartHidden: 'cart:hidden',

        // welcome modal was displayed
        welcomeShown: 'welcome:shown',

        //welcome modal was hidden
        welcomeHidden: 'welcome:hidden'
    };

    return AppEvents;
});

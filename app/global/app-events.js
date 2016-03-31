define([
    'astro-full',
    'vendor/backbone-events'
], function(
    Astro,
    BackboneEvents
) {
    var AppEvents = Astro.Utils.extend({}, BackboneEvents);

    // Dictionary of events raised by the application
    AppEvents.names = {
        // raised when cart modal is displayed
        cartShown: 'cart:shown',

        // raised when cart modal is hidden
        cartHidden: 'cart:hidden',

        // raised when welcome modal is displayed
        welcomeShown: 'welcome:shown',

        // raised when welcome modal is hidden
        welcomeHidden: 'welcome:hidden'
    };

    return AppEvents;
});

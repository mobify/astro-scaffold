define([
    '$'
],
function($) {
    var setOSClass = function() {
        var osClass = Astro.isRunningInIOSApp()
            ? 'astro-ios'
            : 'astro-android';

        $('html').addClass(osClass);
    };

    var globalUI = function() {
        setOSClass();
    };

    globalUI();
});

require(['config'], function() {
    require([
        '$'
    ],
    function(
        $
    ) {
        var setContent = function(errorContent) {
            // Display the back button if the plugin triggering the
            // event is able to handle going back.
            var hidden = !errorContent.canGoBack;
            $('#back').prop('hidden', hidden);

            // Modify error page based on type of error
            $('#title').html(errorContent.title);
            $('#text').html(errorContent.text);
            $('#image').attr('src', errorContent.imgSrc);

            Astro.trigger('astro:page-loaded');
        };

        var bindEvents = function() {
            Astro.on('error:should-load', function(params) {
                setContent(params.errorContent);
            });

            $('#retry').on('click', function() {
                Astro.trigger('retry');
            });

            $('#back').on('click', function() {
                Astro.trigger('back');
            });
        };

        var errorUI = function() {
            bindEvents();
        };

        errorUI();
    });
});

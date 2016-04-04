define([
    '$',
    'navitron',
    'astro-client'
],
function($) {

    // Given a list of menuItems in the specified format,
    // generate HTML that navitron JS will understand.
    // The left menu supports a depth level of 0 to N.
    //
    // ** Note: All leaf nodes require an `href` key. **
    // Format:
    // [{
    //     "title": "Womens",
    //     "subItems": [
    //         {
    //             "title": "New Arrivals",
    //             "subItems": [
    //                 {
    //                     "title": "New In Shop All",
    //                     "href": "/womens/highlights/womens-new-arrivals"
    //                 },
    //                 {
    //                     "title": "New In Clothing",
    //                     "href": "/womens/highlights/new-in-clothing"
    //                 }
    //             ]
    //         }
    //     }, ... ]

    var bodyTemplate = $('body').html();
    var generateNavitronHtml = function(menuItems) {
        var SPACES_PER_TAB = 4;
        var currentTabDepth = 0;
        var generatedHtmlString = '';

        var htmlEscape = function(str) {
            return str.replace('&', '&amp;');
        };

        // pretty printer
        var pr = function(str) {
            var indent = Array((SPACES_PER_TAB * currentTabDepth) + 1).join(' ');
            generatedHtmlString = generatedHtmlString + htmlEscape(str) + '\n';
        };

        var buildNextButton = function(title) {
            pr('<button class="navitron__next-pane" type="button">' + title + '</button>');
        };

        var buildHeader = function(title) {
            pr('<li class="navitron__header">');
            currentTabDepth++;
            pr('<div class="c-bar">');
            currentTabDepth++;
            pr('<button class="c-button navitron__prev-pane" type="button">Back</button>');
            pr('<span class="c-bar__heading">' + title + '</span>');
            currentTabDepth--;
            pr('</div>');
            currentTabDepth--;
            pr('</li>');
        };

        var parseData = function(menuItems) {
            for (var i = 0; i < menuItems.length; i++) {
                var item = menuItems[i];
                buildHtmlForItem(item);
            }
        };

        var buildHtmlForItem = function(item) {
            pr('<li>');
            currentTabDepth++;
            if (item.subItems && item.subItems.length > 0) {
                buildNextButton(item.title);
                pr('<ul>');
                currentTabDepth++;

                buildHeader(item.title);

                parseData(item.subItems);
                currentTabDepth--;
                pr('</ul>');
            } else {
                pr('<a class="navitron-link" href="' + item.href + '">' + item.title + '</a>');
            }
            currentTabDepth--;
            pr('</li>');
        };

        parseData(menuItems);

        return generatedHtmlString;
    };

    var navigateToNewRootView = Astro.jsRpcMethod('navigateToNewRootView', ['url', 'title']);

    var setupNavitron = function() {
        // Setup the glue required to open selected items in the main navigation view
        $('.navitron-link').on('click', function(event) {
            var url = event.target.href;
            var title = event.target.innerText;
            navigateToNewRootView(url, title).error(function(error) {
                console.log('error', error);
            });
            event.preventDefault();
        });

        // Run the secret sauce to create the navitron
        $('#leftMenuNavitron').navitron({
            structure: false,
            shiftAmount: 100
        });
    };

    var renderNavitron = function(menuItems) {
        var generatedHtml = generateNavitronHtml(menuItems);
        $('#menuPlaceHolder').replaceWith(generatedHtml);
        setupNavitron();
    };

    Astro.jsRpcMethod('menuItems', [])().then(function(menuItems) {
        renderNavitron(menuItems);
    });

    // Allows the left drawer to be rerendered by having the drawerController
    // call `renderLeftMenu`.
    Astro.on('setMenuItems', function(params) {
        document.body.innerHTML = bodyTemplate;
        renderNavitron(params.menuItems);
    });
});

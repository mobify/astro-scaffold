define([], function() {
    return {
        general: {
          deepLinkUrl:      'http://www.example.com'
        },
        headerBar: {
          backgroundColor:  '#292929',
          textColor:        '#FFFFFF',
          logoUrl:          'file:///logo.png',
          leftIconUrl:      'file:///icon_left_alt.png',
          rightIconUrl:     'file:///icon_right_alt.png',
          hideBackText:     true,
          translucent:      false,
          statusBarWhite:   true
        },
        mainWebView: {
          url:              'http://www.eddiebauer.com',
          backgroundColor:  '#333333'
        },
        leftMenu: {
          url:              'file:///local_www/left_menu.html',
          backgroundColor:  '#333333'
        },
        rightMenu: {
          url:              'file:///local_www/right_menu.html',
          backgroundColor:  '#333333'
        },
        loadingSpinner: {
          color:            '#333333',
          backgroundColor:  '#cccccc'
        },
        splashLogoUrl: 'file:///astro-demo-splash.png'
    };
});

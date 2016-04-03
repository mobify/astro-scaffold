module.exports = function(grunt) {
    var wwwUiOptions = {
        almond: true,
        wrap: true,
        mainConfigFile: './scaffold-www/js/ui-config.js',
        optimize: 'none',
        keepBuildDir: true,
        name: './app/scaffold-www/js/ui.js',
        out: './scaffold-www/js/dist/ui.js'
    };

    return {
        worker: {
            options: {
                almond: true,
                wrap: true,
                mainConfigFile: './config.js',
                optimize: 'none',
                keepBuildDir: true,
                name: 'app.js',
                out: './build/app.js'
            }
        },
        wwwUi: {
            options: wwwUiOptions
        },
        wwwUiMin: {
            options: grunt.util._.extend(
                grunt.util._.clone(wwwUiOptions),
                {
                    optimize: 'uglify2',
                    generateSourceMaps: false,
                    out: './scaffold-www/js/dist/ui.min.js'
                }
            )
        }
    };
};

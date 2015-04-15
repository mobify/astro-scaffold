// http://stackoverflow.com/questions/13567312/working-project-structure-that-uses-grunt-js-to-combine-javascript-files-using-r

/*global module:false*/
module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        requirejs: {
            worker: {
                options: {
                    almond: true,
                    wrap: true,
                    mainConfigFile: "./config.js",
                    optimize: "none",
                    keepBuildDir: true,
                    name: "app.js",
                    out: "./build/app.js"
                }
            }
        },
        watch: {
            files: ['*.js', 'vendor/*.js'],
            tasks: ['requirejs:worker'],
        }
    });

    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('build', ['requirejs:worker']);
    grunt.registerTask('preview', ['build', 'watch']);
};

// http://stackoverflow.com/questions/13567312/working-project-structure-that-uses-grunt-js-to-combine-javascript-files-using-r
var path = require('path');

/*global module:false*/
module.exports = function(grunt) {
    var _ = grunt.util._;

    grunt.loadNpmTasks('grunt-requirejs');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // By default, we load all local tasks from the tasks directory.
    grunt.file.expand('tasks/*').forEach(function(task) {
        grunt.loadTasks(task);
    });

    var configPaths = [
        'tasks/config/*'
    ];

    // Populate the config object
    var config = {};
    grunt.file.expand(configPaths).forEach(function(configPath) {
        // Get the grunt-task name to put in the config which is based on the
        // name of the config file
        var configName = configPath.match(/\/([^\/]*)\.js/)[1];
        var option = require(path.join(__dirname + '/' + configPath))(grunt);
        config[configName] = _.extend(config[configName] || {}, option);
    });

    grunt.config('pkg', grunt.file.readJSON('package.json'));

    grunt.initConfig(config);

    grunt.registerTask('build', ['lint', 'requirejs:worker']);
    grunt.registerTask('preview', ['build', 'watch']);
};

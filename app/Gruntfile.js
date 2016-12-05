// http://stackoverflow.com/questions/13567312/working-project-structure-that-uses-grunt-js-to-combine-javascript-files-using-r
var path = require('path');

var spawnTask = function(env, callback) {
    var spawnArgs = ['node_modules/nightwatch/bin/runner.js', '-c', 'tests/system/nightwatch-config.js'];

    if (arguments.length === 1) {
        callback = env;
        env = undefined;
    }

    if (env) {
        spawnArgs.push('-e', env);
    }

    grunt.util.spawn({
            cmd: 'node',
            args: [].concat(spawnArgs, grunt.option.flags()),
            opts: {stdio: 'inherit'}
        },
        function(error, result, code) {
            if (code !== 0) {
                grunt.fail.fatal('Tests failed', code);
            }
            callback();
        }
    );
};

/*global module:false*/
module.exports = function(grunt) {
    grunt.registerTask('nightwatch', function() {
        var callback = this.async();
        spawnTask(callback);
    });
};


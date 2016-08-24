module.exports = function(grunt) {
    var lint = require('../jslinting');

    return {
        dev: {
            src: lint.targets,
            options: {
                reset: true,
                configFile: 'node_modules/mobify-code-style/es5/mobify-es5.yml'
            }
        },
        prod: {
            src: lint.targets,
            options: {
                reset: true,
                configFile: 'node_modules/mobify-code-style/es5/mobify-es5.yml'
            }
        }
    };
};

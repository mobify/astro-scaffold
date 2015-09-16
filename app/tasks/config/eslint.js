module.exports = function(grunt) {
    var lint = require('../jslinting');

    return {
        dev: {
            src: lint.targets,
            options: {
                reset: true,
                config: 'node_modules/mobify-code-style/javascript/.eslintrc'
            }
        },
        prod: {
            src: lint.targets,
            options: {
                reset: true,
                config: 'node_modules/mobify-code-style/javascript/.eslintrc'
            }
        }
    };
};

module.exports = function(grunt) {
    return {
        default: {
            files: ['*.js', 'vendor/*.js'],
            tasks: ['requirejs:worker']
        }
    };
};

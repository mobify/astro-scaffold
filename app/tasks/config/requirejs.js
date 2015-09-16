module.exports = function(grunt) {
    return {
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
    };
};

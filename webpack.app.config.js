var webpack = require('webpack');
var path = require('path');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

var rootDir = process.cwd();
var entry = path.resolve(rootDir, 'app/app.js');
var outDir = path.resolve(rootDir, 'build');

var isProd = process.env.NODE_ENV === 'production';
var analyzeBundle = process.env.NODE_ENV === 'Analyze';

var config = {
    entry: entry,
    output: {
        filename: 'app.js',
        path: outDir
    },
    resolve: {
        alias: {
            astro: path.resolve(rootDir, 'node_modules/astro-sdk/js/src/'),
            vendor: path.resolve(rootDir, 'node_modules/astro-sdk/js/vendor/')
        }
    },
    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),
        new webpack.LoaderOptionsPlugin({
            options: {
                eslint: {
                    configFile: path.resolve(rootDir, '.eslintrc.yml')
                }
            }
        })
    ],
    module: {
        rules: [{
            test: /\.js$/,
            enforce: 'pre',
            use: ['eslint-loader'],
            exclude: /node_modules/
        }]
    }
};

if (isProd) {
    config.plugins = config.plugins.concat([
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin()
    ]);
} else if (analyzeBundle) {
    config.plugins = config.plugins.concat([
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: true
        })
    ]);
}

module.exports = config;

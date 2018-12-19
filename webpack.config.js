let path = require('path');
let webpack = require('webpack');
let pk = require('./package.json');

module.exports = [{
    mode: 'production',
    entry: './src/weRequest.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'weRequest.min.js',
        library: "weRequest",
        libraryTarget: "commonjs-module"
    },
    plugins: [
        new webpack.BannerPlugin({
            banner: `weRequest ${pk.version}\n${pk.homepage}`
        })
    ]
}, {
    mode: 'development',
    entry: './src/weRequest.js',
    output: {
        path: path.join(__dirname, 'build'),
        filename: 'weRequest.js',
        library: "weRequest",
        libraryTarget: "commonjs-module"
    },
    devtool: 'inline-source-map',
    plugins: [
        new webpack.BannerPlugin({
            banner: `weRequest ${pk.version}\n${pk.homepage}`
        })
    ]
}]

var path = require('path');
var webpack = require('webpack');
var UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

module.exports = {
	entry: './src/weRequest.js',
    output: {
		path: path.join(__dirname, 'build'),
		filename: 'weRequest.js',
		library: "weRequest",
        libraryTarget: "commonjs-module"
	},
	plugins: [
		new UglifyJsPlugin({
			compress: {
				warnings: false
			},
			except: []
		})
	]
}
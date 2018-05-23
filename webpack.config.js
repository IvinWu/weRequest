var path = require('path');

module.exports = {
	//mode: 'development',
	mode: 'production',
	entry: './src/weRequest.js',
    output: {
		path: path.join(__dirname, 'build'),
		filename: 'weRequest.js',
		library: "weRequest",
        libraryTarget: "commonjs-module"
	},
	//devtool: 'inline-source-map'
}
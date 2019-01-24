let path = require("path");
let webpack = require("webpack");
let pk = require("./package.json");

module.exports = [
    {
        mode: "production",
        entry: "./src/index.ts",
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"]
        },
        output: {
            path: path.join(__dirname, "build"),
            filename: "weRequest.min.js",
            library: "weRequest",
            libraryTarget: "commonjs-module",
            libraryExport: "default"
        },
        plugins: [
            new webpack.BannerPlugin({
                banner: `weRequest ${pk.version}\n${pk.homepage}`
            })
        ]
    },
    {
        mode: "development",
        entry: "./src/index.ts",
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: "ts-loader",
                    exclude: /node_modules/
                }
            ]
        },
        resolve: {
            extensions: [".tsx", ".ts", ".js"]
        },
        output: {
            path: path.join(__dirname, "build"),
            filename: "weRequest.js",
            library: "weRequest",
            libraryTarget: "commonjs-module",
            libraryExport: "default"
        },
        devtool: "inline-source-map",
        plugins: [
            new webpack.BannerPlugin({
                banner: `weRequest ${pk.version}\n${pk.homepage}`
            })
        ]
    }
];

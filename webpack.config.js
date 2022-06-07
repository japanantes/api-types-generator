const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
    mode: "development",
    entry: "./index.ts",
    devtool: "inline-source-map",
    target: "node",
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.[jt]s$/,
                use: "ts-loader",
                exclude: /(node_modules|dist)/,
            },
        ],
    },
    resolve: { extensions: [".ts", ".js"] },
    output: {
        filename: "index.js",
        path: path.resolve(__dirname, "dist"),
        library: "ATGen",
        libraryTarget: "umd",
        globalObject: "this",
        umdNamedDefine: true,
    },
    watchOptions: {
        aggregateTimeout: 4,
        ignored: "**/node_modules",
    },
};

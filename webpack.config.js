const webpack = require("webpack");
const path = require("path");

const extractCommons = new webpack.optimize.CommonsChunkPlugin({
    name: 'commons',
    filename: 'common.js'
});
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractCSS = new ExtractTextPlugin('[name].bundle.css');

const config = {
    entry: {
        app: "./app.js"
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                include: path.resolve(__dirname, "dist"),
                use: [{
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ["es2015", { "modules": false }]
                        ]
                    }
                }]
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader", "css-loader"
                ]
            }
        ]
    }
};

module.exports = config;
const webpack = require("webpack");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const { path } = require("../utils");

module.exports = ({ env, status, domain, sns, sourcemap, minify }) => {
    const version = "20171121";

    return {
        module: {
            rules: [
                {
                    test: /\.js(x)?$/,
                    enforce: "pre",
                    exclude: /node_modules/
                    /*use: [
                        {
                            loader: "eslint-loader",
                            options: {
                                failOnWarning: true,
                                failOnError: true
                            }
                        }
                    ]*/
                },
                {
                    test: /\.js(x)?$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: "babel-loader",
                            options: {
                                presets: [
                                    ["es2015", { "modules": false }],
                                    "react",
                                    "stage-2"
                                ],
                                plugins: [
                                    ["transform-proto-to-assign"],
                                    ["transform-es2015-classes", { "loose": true }]
                                ],
                                cacheDirectory: true
                            }
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: env.prod
                        ? ExtractTextPlugin.extract({
                            use: [
                                { loader: "css-loader" },
                                { loader: "postcss-loader" }
                            ]
                        })
                        : [
                            { loader: "style-loader" },
                            { loader: "css-loader" },
                            { loader: "postcss-loader" }
                        ]
                },
                {
                    test: /\.scss$/,
                    use: env.prod
                        ? ExtractTextPlugin.extract({
                            use: [
                                { loader: "css-loader", options: { sourceMap: sourcemap, minimize: env.prod } },
                                { loader: "postcss-loader" },
                                { loader: "sass-loader", options: { sourceMap: sourcemap } }
                            ]
                        })
                        : [
                            { loader: "style-loader" },
                            { loader: "css-loader", options: { sourceMap: sourcemap, minimize: env.prod } },
                            { loader: "postcss-loader" },
                            { loader: "sass-loader", options: { sourceMap: sourcemap } }
                        ]
                },
                {
                    test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 10000,
                                mimetype: "application/font-otf",
                                name: "fonts/[name].[sha512:hash:base64:7].[ext]"
                            }
                        }
                    ]
                },
                {
                    test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 10000,
                                mimetype: "application/font-woff",
                                name: "fonts/[name].[sha512:hash:base64:7].[ext]"
                            }
                        }
                    ]
                },
                {
                    test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 10000,
                                mimetype: "application/font-woff",
                                name: "fonts/[name].[sha512:hash:base64:7].[ext]"
                            }
                        }
                    ]
                },
                {
                    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 10000,
                                mimetype: "application/octet-stream",
                                name: "fonts/[name].[sha512:hash:base64:7].[ext]"
                            }
                        }
                    ]
                },
                {
                    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                name: "fonts/[name].[sha512:hash:base64:7].[ext]"
                            }
                        }
                    ]
                },
                {
                    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        {
                            loader: "url-loader",
                            options: {
                                limit: 10000,
                                mimetype: "image/svg+xml",
                                name: "fonts/[name].[sha512:hash:base64:7].[ext]"
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new webpack.LoaderOptionsPlugin({
                options: {
                    context: path.root(),
                    sassLoader: {
                        data: `$IMG_SERVER: "${domain.server.img}"; $DOMAIN: "${domain.host_addr}";`
                    }
                }
            }),
            new ExtractTextPlugin({
                filename: `[name].[contenthash].css?v=${version}`,
                // filename: "[name].[contenthash].css",
                disable: !env.prod,
                allChunks: true
            }),
            new webpack.DefinePlugin({
                "process.env": {
                    NODE_ENV: JSON.stringify(env.name)
                },
                __STATUS__: JSON.stringify(status.name),
                __DOMAIN__: JSON.stringify(domain.host_addr),
                __SERVER__: JSON.stringify(domain.server),

                __WEB__: JSON.stringify(domain.web),
                __DESKTOP__: JSON.stringify(domain.desktop),
                __MOBILE__: JSON.stringify(domain.mobile)
            })
        ],
        resolve: {
            modules: [
                "node_modules",
                path.root()
            ],
            extensions: [".js", ".jsx"],
            alias: {
                forsnap: path.shared("forsnap.js")
            }
        },
        performance: {
            hints: false
        }
    };
};

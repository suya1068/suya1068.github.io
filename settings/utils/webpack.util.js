const webpack = require("webpack");
const ManifestPlugin = require("webpack-manifest-plugin");
const path = require("./path.util.js");

module.exports = {
    /**
     * webpack entry를 설정한다.
     * @param {Array.<{name: string, files: Array}>} [data = []]
     * @param {object} env
     * @param {domain} domain
     * @returns {{entry: *}}
     */
    entry(data = [], { env, domain }) {
        const result = data.reduce((box, { name, files }) => {
            box[name] = files;
            return box;
        }, {});

        if (env.dev) {
            result.common.unshift(`webpack-dev-server/client?${domain.host_addr}/`, "webpack/hot/only-dev-server");
        }

        return { entry: result };
    },

    /**
     * webpack output을 설정한다.
     * @param {{path: string, publicPath: string}} data
     * @param {object} env
     * @param {object} domain
     * @returns {{output: *}}
     */
    output(data, { env, domain }) {
        const version = "20171121";
        const result = env.prod
            ? {
                path: data.path,
                filename: `[name].[chunkhash].js?v=${version}`,
                // filename: "[name].[chunkhash].js",
                chunkFilename: "[id].[chunkhash].js",
                publicPath: `/${data.publicPath}/`
            }
            : {
                path: data.path,
                filename: "[name].js",
                chunkFilename: "[id].js",
                publicPath: `${domain.host_addr}/${data.publicPath}/`
            };

        return { output: result };
    },

    /**
     * webpack commonChunks를 설정한다.
     * @param {{chunks: Array, publicPath}} data
     * @param {object} env
     * @param {object} domain
     * @returns {{plugins: [*,*]}}
     */
    commonChunks(data, { env, domain }) {
        return {
            plugins: [
                new webpack.optimize.CommonsChunkPlugin(data.chunks),
                new ManifestPlugin({
                    writeToFileEmit: true,
                    publicPath: env.prod ? `/${data.publicPath}/` : `${domain.host_addr}/${data.publicPath}/`
                })
            ]
        };
    },

    /**
     * externals 옵션을 생성한다.
     * @param {Array.<{path: string, alias: string}>} data
     * @return {{externals: {}, module: {}, resolve: {}}}
     */
    externals(data = []) {
        return {
            externals: data.reduce((box, d) => {
                box[d.path] = d.alias;
                return box;
            }, {})
        };
    },

    /**
     * 글로벌로 변수를 선언한다.
     * @param {Array.<{name:string, path:string}>} data
     * @returns {*}
     */
    expose(data = []) {
        return data.length > 0
            ? {
                module: {
                    rules: data.map(d => {
                        return {
                            test: require.resolve(d.path),
                            use: `expose-loader?${d.name}`
                        };
                    })
                }
            }
            : null;
    },

    /**
     * 접근이 용이하도록 alias 이름을 선언한다.
     * @param {Array.<{name:string, path:string}>} data
     * @returns {*}
     */
    alias(data = []) {
        return data.length > 0
            ? {
                resolve: {
                    alias: data.reduce((box, d) => {
                        box[d.name] = d.path;
                        return box;
                    }, {})
                }
            }
            : null;
    },

    /**
     * webpack global로 사용할 변수를 선언한다.
     * @param {object} variable
     * @return {{plugins: [*]}}
     */
    defineVariables(variable) {
        return {
            plugins: [
                new webpack.DefinePlugin(variable)
            ]
        };
    },

    /**
     * 파일을 압축한다.
     * @param {boolean} [sourcemap = false]
     * @returns {{plugins: [*]}}
     */
    minify(sourcemap = false) {
        return {
            plugins: [
                new webpack.optimize.UglifyJsPlugin()
            ]
        };
    },

    /**
     * karma test를 위한 devSever 옵션을 가져온다.
     */
    testDevServer() {
        return {
            noInfo: true,
            watchOptions: {
                aggregateTimeout: 300,
                poll: 1000
            },
            stats: {
                chunks: false
            }
        };
    }
};

const webpack = require("webpack");
const merge = require("webpack-merge");
const { bundle } = require("../utils");
const webpackBaseConfig = require("./webpack_base.conf.js");

module.exports = (data, config) => {
    let entry = [...data.entry];
    if (data.demo) {
        entry = [...entry, ...data.demo];
    }

    const result = merge(
        webpackBaseConfig(config),
        {
            cache: true,
            devtool: config.sourcemap ? "source-map" : false
        },
        bundle.entry(entry, config),
        bundle.output(data.output, config),
        bundle.commonChunks({ chunks: data.commonChunks, publicPath: data.output.publicPath }, config),
        bundle.expose(data.expose),
        bundle.alias(data.alias),
        //bundle.externals(data.externals),
        bundle.defineVariables({
            __SNS__: JSON.stringify(config.sns),
            __IMP__: JSON.stringify(config.imp)
        }),
        {
            plugins: [
                new webpack.HotModuleReplacementPlugin()
            ],
            devServer: {
                host: "0.0.0.0",
                port: config.domain.port.livereload,
                proxy: {
                    "**": config.domain.proxy
                },
                historyApiFallback: true,
                hot: true,
                inline: true
            }
        }
    );

    return result;
};

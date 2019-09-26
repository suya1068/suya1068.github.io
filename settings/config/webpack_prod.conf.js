const merge = require("webpack-merge");
const { bundle } = require("../utils");
const webpackBaseConfig = require("./webpack_base.conf.js");

module.exports = (data, config) => {
    const result = merge(
        webpackBaseConfig(config),
        {
            cache: false,
            devtool: config.sourcemap ? "source-map" : false
        },
        bundle.entry(data.entry, config),
        bundle.output(data.output, config),
        bundle.commonChunks({ chunks: data.commonChunks, publicPath: data.output.publicPath }, config),
        bundle.expose(data.expose),
        bundle.alias(data.alias),
        //bundle.externals(data.externals),
        bundle.defineVariables({
            __SNS__: JSON.stringify(config.sns),
            __IMP__: JSON.stringify(config.imp)
        }),
        bundle.minify(config.sourcemap)
    );

    return result;
};

require("babel-polyfill");
const webpack = require("webpack");
const { resolve } = require("path");
const { environment, bundle } = require("./utils");
const desktopData = require("./services/desktop.svc");
const webpackDevConfig = require("./config/webpack_dev.conf");
const webpackProdConfig = require("./config/webpack_prod.conf");

const root = resolve(__dirname, "../");

module.exports = env => {
    const config = environment("desktop", env);
    const data = desktopData();

    if (config.env.dev) {
        return webpackDevConfig(data, config);
    }

    if (config.env.prod) {
        return webpackProdConfig(data, config);
    }

    return null;
};

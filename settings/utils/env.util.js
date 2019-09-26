const stringToBoolean = require("./stringToBoolean.util.js");
const { SERVER, SNS, IMP } = require("../constant");

const hasOwnProperty = (target, name) => Object.prototype.hasOwnProperty.call(target, name);

const getHostAddress = ({ env, status, host, port }) => {
    if (env.dev) {
        return status.dev ? `http://${host}:${port.livereload}` : `http://${host}`;
    }

    return status.live ? `https://${host}` : `http://${host}`;
};

module.exports = (name, env) => {
    const result = { service: name, name: env.name, status: {}, env: {}, domain: {}, sns: {}, sourcemap: true, minify: false };

    /**
     * 개발 상태
     */
    result.status = (() => {
        if (!["dev", "beta", "stage", "live"].includes(env.status)) {
            throw new Error("The env.status is invalid.");
        }

        const status = { name: env.status, dev: false, beta: false, stage: false, live: false };
        status[env.status] = true;
        return status;
    })();

    /**
     * 개발 환경
     */
    result.env = (() => {
        const environment = { name: "", dev: false, prod: false, test: false };
        if (env.dev) {
            environment.name = "development";
            environment.dev = true;
            return environment;
        }

        if (env.prod) {
            environment.name = "production";
            environment.prod = true;
            return environment;
        }

        return null;
    })();

    /**
     * 서버 정보
     */
    result.domain = (() => {
        let info = null;

        if (result.status.dev) {
            if (!result.name) { throw new Error("The env.name is require."); }
            info = SERVER[result.status.name][result.name];
        } else {
            info = SERVER[result.status.name];
        }

        const host = info.host[result.service];
        const port = info.port;
        const proxy = info.proxy;
        const server = info.server;

        const hostOption = { env: result.env, status: result.status, port };

        return {
            // 도메인 공유
            web: info.host.web,

            // domain 변경을 위한 로직
            desktop: getHostAddress({ ...hostOption, host: info.host.desktop }),
            mobile: getHostAddress({ ...hostOption, host: info.host.mobile }),
            host_addr: getHostAddress({ ...hostOption, host }),
            host,
            port,
            proxy,
            server
        };
    })();

    // SNS
    result.sns = SNS[result.status.name];

    // 아임포트
    result.imp = IMP[result.status.name];

    result.sourcemap = hasOwnProperty(env, "sourcemap") ? stringToBoolean(env.sourcemap) : result.env.dev;
    result.minify = hasOwnProperty(env, "minify") ? stringToBoolean(env.minify) : result.env.prod;

    process.env.BABEL_ENV = result.env.name;
    process.env.NODE_ENV = result.env.name;

    return result;
};

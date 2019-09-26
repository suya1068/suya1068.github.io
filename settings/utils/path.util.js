const { join, resolve } = require("path");
const { MANIFEST } = require("../constant");

const root = resolve(__dirname, "../../");

module.exports = MANIFEST.project_path.reduce((result, { name, path }) => {
    const base = name === "root" ? "" : path;
    result[name] = (extra = "", isRelative = false) => {
        return isRelative ? join(base, extra) : resolve(root, base, extra);
    };

    return result;
}, {});

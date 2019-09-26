module.exports = (value) => {
    if (typeof value === "boolean") {
        return value;
    }

    switch (value.trim()) {
        case 1: case "true": return true;
        case 0: case "false": return false;
        default: return false;
    }
};

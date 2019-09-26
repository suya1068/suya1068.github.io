module.exports = {
    extends: [
        "stylelint-config-standard"
    ],
    rules: {
        indentation: 4,
        "max-empty-lines": 10,
        "declaration-empty-line-before": false,
        "at-rule-empty-line-before": ["always", {
            except: ["first-nested"],
            ignore: ["all-nested", "after-comment", "blockless-after-same-name-blockless"]
        }],
        "block-closing-brace-empty-line-before": false
    }
};

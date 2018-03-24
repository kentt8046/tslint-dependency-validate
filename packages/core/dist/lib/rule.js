"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path = require("path");
const file_1 = require("./file");
const match_1 = require("./match");
exports.evaluteRule = (info, rule) => {
    const { sourceName } = info;
    // そもそもimportsがない -> チェックしない
    if (!rule.imports)
        return -1;
    // lint対象のファイルかどうか
    let isTarget = false;
    if (Array.isArray(rule.sources)) {
        isTarget = match_1.isMatch(sourceName, rule.sources);
    }
    if (isTarget && Array.isArray(rule.excludes)) {
        isTarget = !match_1.isMatch(sourceName, rule.excludes);
    }
    if (!isTarget)
        return 1;
    return relativeImport(info, rule) || moduleImport(info, rule);
};
const relativeImport = ({ moduleName, sourceDir }, { imports: { relative, resolve } }) => {
    if (moduleName.startsWith(".")) {
        if (Array.isArray(relative) && match_1.isMatch(moduleName, relative)) {
            return 2;
        }
        const moduleFullName = sourceDir
            ? path.resolve(sourceDir, moduleName)
            : moduleName;
        if (Array.isArray(resolve) && match_1.isMatch(moduleFullName, resolve)) {
            return 3;
        }
    }
    return 0;
};
const moduleImport = ({ moduleName }, { imports: { native, nodeModules } }) => {
    if (file_1.isNativeModule(moduleName) && native) {
        return 4;
    }
    else if (Array.isArray(nodeModules) && match_1.isMatch(moduleName, nodeModules)) {
        return 5;
    }
    return 0;
};
exports.resolveExtends = (rules) => {
    const ruleMap = rules.reduce((r, rule) => (Object.assign({}, r, { [rule.name]: rule })), {});
    const extend = (_a) => {
        var { extends: x } = _a, rule = tslib_1.__rest(_a, ["extends"]);
        if (!x || !Array.isArray(x))
            return rule;
        return x
            .map(name => ruleMap[name])
            .filter(r => r)
            .reduce((r, xRule) => {
            const { relative = [], resolve = [], native, nodeModules = [], } = extend(xRule).imports;
            return Object.assign({}, r, { imports: {
                    relative: [...(r.imports.relative || []), ...relative],
                    resolve: [...(r.imports.resolve || []), ...resolve],
                    native: r.imports.native || native,
                    nodeModules: [...(r.imports.nodeModules || []), ...nodeModules],
                } });
        }, rule);
    };
    return rules.map(extend);
};
//# sourceMappingURL=rule.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const minimatch = require("minimatch");
const options = {
    dot: true,
};
function isMatch(target, patterns) {
    for (const pattern of patterns) {
        if (minimatch(target, pattern, options))
            return true;
    }
    return false;
}
const builtinModules = (() => {
    const blacklist = [
        "freelist",
        "sys"
    ];
    return Object.keys(process.binding("natives")).filter(function (el) {
        return !/^_|^internal|\//.test(el) && blacklist.indexOf(el) === -1;
    }).sort();
})();
function isBuiltinModule(id) {
    return builtinModules.includes(id);
}
function evaluteRule(info, rule, _expect) {
    const { rootDir, sourceDir, sourceName, moduleName, } = info;
    const expect = !!_expect;
    let isTarget = isMatch(sourceName, rule.sources);
    if (Array.isArray(rule.excludes)) {
        isTarget = isTarget && !isMatch(sourceName, rule.excludes);
    }
    if (!isTarget)
        return 1;
    if (Array.isArray(rule.imports)) {
        const matched = isMatch(moduleName, rule.imports);
        if (matched)
            return expect;
    }
    if (Array.isArray(rule.resolved)) {
        let moduleFullName;
        if (moduleName.startsWith(".")) {
            moduleFullName = path_1.resolve(sourceDir, moduleName);
        }
        else {
            moduleFullName = require.resolve(moduleName);
        }
        moduleFullName = moduleFullName.replace(`${rootDir}/`, "");
        const matched = ((isBuiltinModule(moduleFullName) && !!rule.builtin) ||
            isMatch(moduleFullName, rule.resolved));
        if (expect === matched)
            return 3;
        return 0;
    }
    return 4;
}
function visitImportDeclaration(node, FAILURE_STRING, expect) {
    const _options = this.getOptions();
    if (Array.isArray(_options) && Array.isArray(_options[0])) {
        const [options] = _options;
        const rootDir = process.cwd();
        const sourceInfo = node.parent;
        const importInfo = node.moduleSpecifier;
        const moduleName = importInfo.getText().replace(/("|')/g, "");
        const info = {
            rootDir,
            sourceName: sourceInfo.fileName.replace(`${rootDir}/`, ""),
            sourceDir: path_1.dirname(sourceInfo.fileName).replace(`${rootDir}/`, ""),
            moduleName,
        };
        for (const rule of options) {
            const matched = evaluteRule(info, rule, expect);
            if (matched)
                break;
            const start = importInfo.end - moduleName.length - 1;
            this.addFailureAt(start, moduleName.length, `${FAILURE_STRING} [${rule.name}]`);
        }
    }
}
exports.visitImportDeclaration = visitImportDeclaration;
//# sourceMappingURL=util.js.map
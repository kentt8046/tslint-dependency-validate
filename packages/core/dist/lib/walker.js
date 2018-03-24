"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = require("path");
const ts = require("typescript");
const file_1 = require("./file");
const match_1 = require("./match");
const options_1 = require("./options");
function evaluteRule(info, rule) {
    const { rootDir, sourceDir, sourceName, moduleName } = info;
    let isTarget = match_1.isMatch(sourceName, rule.sources);
    if (Array.isArray(rule.excludeSources)) {
        isTarget = isTarget && !match_1.isMatch(sourceName, rule.excludeSources);
    }
    if (!isTarget)
        return 1;
    const hasImport = Array.isArray(rule.imports);
    if (Array.isArray(rule.imports)) {
        const matched = match_1.isMatch(moduleName, rule.imports);
        if (matched)
            return true;
    }
    if (Array.isArray(rule.resolvedImports)) {
        let moduleFullName;
        if (moduleName.startsWith(".")) {
            // relative import
            moduleFullName = path_1.resolve(sourceDir, moduleName);
        }
        else {
            // node module import
            moduleFullName = require.resolve(moduleName);
        }
        moduleFullName = moduleFullName.replace(`${rootDir}/`, "");
        const matched = (file_1.isBuiltinModule(moduleFullName) && !!rule.builtin) ||
            match_1.isMatch(moduleFullName, rule.resolvedImports);
        if (matched)
            return 3;
        return 0;
    }
    return hasImport && 4;
}
function visitImportDeclaration(source, expression, FAILURE_STRING) {
    const options = this.getOptions();
    const winfo = options_1.getWalkerInfo(source.fileName, Array.isArray(options) && options[0]);
    if (winfo) {
        const { rules } = winfo, info = tslib_1.__rest(winfo, ["rules"]);
        const moduleName = expression.getText().replace(/("|')/g, "");
        for (const rule of rules) {
            const matched = evaluteRule(Object.assign({}, info, { moduleName }), rule);
            if (matched)
                break;
            const start = expression.end - moduleName.length - 1;
            this.addFailureAt(start, moduleName.length, `${FAILURE_STRING} [${rule.name}]`);
        }
    }
}
exports.visitImportDeclaration = visitImportDeclaration;
function getExpression(node) {
    if (node.kind === ts.SyntaxKind.ImportDeclaration ||
        node.kind === ts.SyntaxKind.ExportDeclaration) {
        return node.moduleSpecifier;
    }
    else if (node.kind === ts.SyntaxKind.CallExpression) {
        return node.arguments[0];
    }
    throw new Error("unsupported kind.");
}
exports.getExpression = getExpression;
//# sourceMappingURL=walker.js.map
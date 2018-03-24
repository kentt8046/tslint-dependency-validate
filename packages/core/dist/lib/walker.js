"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const ts = require("typescript");
const file_1 = require("./file");
const match_1 = require("./match");
const options_1 = require("./options");
function evaluteRule(info, rule) {
    const { rootDir, sourceDir, sourceName, moduleName } = info;
    // そもそもimportsがない -> チェックしない
    if (!rule.imports)
        return -1;
    // lint対象のファイルかどうか
    let isTarget = match_1.isMatch(sourceName, rule.sources);
    if (Array.isArray(rule.excludes)) {
        isTarget = isTarget && !match_1.isMatch(sourceName, rule.excludes);
    }
    if (!isTarget)
        return 1;
    return relativeImport(info, rule) || moduleImport(info, rule);
}
const relativeImport = ({ moduleName, sourceDir, rootDir }, { imports: { relative, resolve } }) => {
    if (moduleName.startsWith(".")) {
        if (Array.isArray(relative) && match_1.isMatch(moduleName, relative)) {
            return 2;
        }
        const moduleFullName = path
            .resolve(sourceDir, moduleName)
            .replace(`${rootDir}/`, "");
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
function visitImportDeclaration(source, expression, FAILURE_STRING) {
    const options = this.getOptions();
    const info = options_1.getWalkerInfo(source.fileName, Array.isArray(options) && options[0]);
    if (info) {
        const moduleName = expression.getText().replace(/("|')/g, "");
        for (const rule of info.rules) {
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
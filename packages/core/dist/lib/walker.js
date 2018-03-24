"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const options_1 = require("./options");
const rule_1 = require("./rule");
function visitImportDeclaration(source, expression, FAILURE_STRING) {
    const options = this.getOptions();
    const info = options_1.getWalkerInfo(source.fileName, Array.isArray(options) && options[0]);
    if (info) {
        const moduleName = expression.getText().replace(/("|')/g, "");
        for (const rule of rule_1.resolveExtends(info.rules)) {
            const matched = rule_1.evaluteRule(Object.assign({}, info, { moduleName }), rule);
            if (matched)
                continue;
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
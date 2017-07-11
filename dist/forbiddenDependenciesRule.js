"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const Lint = require("tslint");
const util_1 = require("./util");
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new ForbiddenDependenciesRuleWalker(sourceFile, this.getOptions()));
    }
}
Rule.FAILURE_STRING = "this dependency is forbidden.";
exports.Rule = Rule;
class ForbiddenDependenciesRuleWalker extends Lint.RuleWalker {
    visitImportDeclaration(node) {
        try {
            const source = node.getSourceFile();
            const expression = util_1.getExpression(node);
            util_1.visitImportDeclaration.call(this, source, expression, Rule.FAILURE_STRING);
        }
        catch (err) {
            this.addFailureAtNode(node, "syntax error");
        }
        super.visitImportDeclaration(node);
    }
    visitCallExpression(node) {
        if (node.getText().startsWith("require(") ||
            node.getText().startsWith("import(")) {
            try {
                const source = node.getSourceFile();
                const expression = util_1.getExpression(node);
                util_1.visitImportDeclaration.call(this, source, expression, Rule.FAILURE_STRING);
            }
            catch (err) {
                this.addFailureAtNode(node, "syntax error");
            }
        }
        super.visitCallExpression(node);
    }
    visitNode(node) {
        if (node.kind === ts.SyntaxKind.ExportDeclaration) {
            try {
                const source = node.getSourceFile();
                const expression = util_1.getExpression(node);
                util_1.visitImportDeclaration.call(this, source, expression, Rule.FAILURE_STRING);
            }
            catch (err) {
                this.addFailureAtNode(node, "syntax error");
            }
        }
        super.visitNode(node);
    }
}
//# sourceMappingURL=forbiddenDependenciesRule.js.map
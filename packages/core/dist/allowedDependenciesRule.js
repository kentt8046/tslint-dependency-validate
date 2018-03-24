"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const Lint = require("tslint");
const walker_1 = require("./lib/walker");
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new AllowedDependenciesRuleWalker(sourceFile, this.getOptions()));
    }
}
Rule.FAILURE_STRING = "this dependency is not allowed.";
Rule.metadata = {
    ruleName: "allowed-dependencies",
    type: "maintainability",
    description: "rule of allowed module in import or require",
    optionsDescription: "",
    options: null,
    typescriptOnly: false,
};
exports.Rule = Rule;
class AllowedDependenciesRuleWalker extends Lint.RuleWalker {
    visitImportDeclaration(node) {
        try {
            const source = node.getSourceFile();
            const expression = walker_1.getExpression(node);
            walker_1.visitImportDeclaration.call(this, source, expression, Rule.FAILURE_STRING);
        }
        catch (err) {
            this.addFailureAtNode(node, "syntax error");
        }
        super.visitImportDeclaration(node);
    }
    visitCallExpression(node) {
        const funcName = node.expression.getText();
        if (funcName === "require" || funcName === "import") {
            try {
                const source = node.getSourceFile();
                const expression = walker_1.getExpression(node);
                walker_1.visitImportDeclaration.call(this, source, expression, Rule.FAILURE_STRING, true);
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
                const expression = walker_1.getExpression(node);
                walker_1.visitImportDeclaration.call(this, source, expression, Rule.FAILURE_STRING);
            }
            catch (err) {
                this.addFailureAtNode(node, "syntax error");
            }
        }
        super.visitNode(node);
    }
}
//# sourceMappingURL=allowedDependenciesRule.js.map
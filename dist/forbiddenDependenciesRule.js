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
Rule.metadata = {
    ruleName: "forbidden-dependencies",
    type: "maintainability",
    description: "rule of forbidden module in import or require",
    optionsDescription: "",
    options: null,
    typescriptOnly: false
};
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
        const funcName = node.expression.getText();
        if (funcName === "require" || funcName === "import") {
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
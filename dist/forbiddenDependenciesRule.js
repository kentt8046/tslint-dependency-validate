"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        util_1.visitImportDeclaration.call(this, node, Rule.FAILURE_STRING);
        super.visitImportDeclaration(node);
    }
}
//# sourceMappingURL=forbiddenDependenciesRule.js.map
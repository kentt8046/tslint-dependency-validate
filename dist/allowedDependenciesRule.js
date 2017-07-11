"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lint = require("tslint");
const util_1 = require("./util");
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new AllowedDependenciesRuleWalker(sourceFile, this.getOptions()));
    }
}
Rule.FAILURE_STRING = "this dependency is not allowed.";
exports.Rule = Rule;
class AllowedDependenciesRuleWalker extends Lint.RuleWalker {
    visitImportDeclaration(node) {
        util_1.visitImportDeclaration.call(this, node, Rule.FAILURE_STRING, true);
        super.visitImportDeclaration(node);
    }
}
//# sourceMappingURL=allowedDependenciesRule.js.map
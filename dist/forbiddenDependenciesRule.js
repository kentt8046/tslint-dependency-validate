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
        const _options = this.getOptions();
        if (Array.isArray(_options) && Array.isArray(_options[0])) {
            const [options] = _options;
            const sourceInfo = node.parent;
            const sourceName = sourceInfo.fileName;
            const importInfo = node.moduleSpecifier;
            const moduleName = importInfo.getText().replace(/("|')/g, "");
            for (const rule of options) {
                let isTarget = util_1.isMatch(sourceName, rule.sources);
                if (Array.isArray(rule.excludes)) {
                    isTarget = isTarget && !util_1.isMatch(sourceName, rule.excludes);
                }
                if (!isTarget)
                    break;
                const forbidden = util_1.isMatch(moduleName, rule.imports);
                if (!forbidden)
                    break;
                const start = importInfo.end - moduleName.length - 1;
                this.addFailureAt(start, moduleName.length, `${Rule.FAILURE_STRING} [${rule.name}]`);
            }
        }
        super.visitImportDeclaration(node);
    }
}
//# sourceMappingURL=forbiddenDependenciesRule.js.map
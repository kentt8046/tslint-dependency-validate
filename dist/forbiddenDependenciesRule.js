"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Lint = require("tslint");
const minimatch = require("minimatch");
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
                const isTarget = isMatch(sourceName, rule.sources);
                if (!isTarget)
                    break;
                const forbidden = isMatch(moduleName, rule.imports);
                if (!forbidden)
                    break;
                this.addFailureAt(importInfo.pos, importInfo.end, `${Rule.FAILURE_STRING} [${rule.name}]`);
            }
        }
        super.visitImportDeclaration(node);
    }
}
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
//# sourceMappingURL=forbiddenDependenciesRule.js.map
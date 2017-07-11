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
        const _options = this.getOptions();
        if (Array.isArray(_options) && Array.isArray(_options[0])) {
            const [options] = _options;
            const rootDir = process.cwd();
            const sourceInfo = node.parent;
            const sourceName = sourceInfo.fileName.replace(`${rootDir}/`, "");
            const importInfo = node.moduleSpecifier;
            const moduleName = importInfo.getText().replace(/("|')/g, "");
            for (const rule of options) {
                let isTarget = util_1.isMatch(sourceName, rule.sources);
                if (Array.isArray(rule.excludes)) {
                    isTarget = isTarget && !util_1.isMatch(sourceName, rule.excludes);
                }
                if (!isTarget)
                    break;
                const allowed = util_1.isMatch(moduleName, rule.imports);
                if (allowed)
                    break;
                const start = importInfo.end - moduleName.length - 1;
                this.addFailureAt(start, moduleName.length, `${Rule.FAILURE_STRING} [${rule.name}]`);
            }
        }
        super.visitImportDeclaration(node);
    }
}
//# sourceMappingURL=allowedDependenciesRule.js.map
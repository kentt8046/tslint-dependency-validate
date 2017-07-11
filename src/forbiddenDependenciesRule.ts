import * as ts from "typescript";
import * as Lint from "tslint";

import { isMatch } from "./util";
import { DependencyRule } from "./interface";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "this dependency is forbidden.";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new ForbiddenDependenciesRuleWalker(sourceFile, this.getOptions()));
  }
}

class ForbiddenDependenciesRuleWalker extends Lint.RuleWalker {
  public visitImportDeclaration(node: ts.ImportDeclaration) {
    const _options = this.getOptions();
    if (Array.isArray(_options) && Array.isArray(_options[0])) {
      const [options]: DependencyRule[][] = _options;

      const sourceInfo = <ts.SourceFile>node.parent;
      const sourceName = sourceInfo.fileName;

      const importInfo = node.moduleSpecifier;
      const moduleName = importInfo.getText().replace(/("|')/g, "");

      for (const rule of options) {
        let isTarget = isMatch(sourceName, rule.sources);
        if (Array.isArray(rule.excludes)) {
          isTarget = isTarget && !isMatch(sourceName, rule.excludes);
        }
        if (!isTarget) break;
        const forbidden = isMatch(moduleName, rule.imports);
        if (!forbidden) break;
        const start = importInfo.end - moduleName.length - 1;
        this.addFailureAt(start, moduleName.length, `${Rule.FAILURE_STRING} [${rule.name}]`);
      }
    }

    super.visitImportDeclaration(node);
  }
}

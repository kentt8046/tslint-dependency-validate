import * as ts from "typescript";
import * as Lint from "tslint";

import * as minimatch from "minimatch";

import { DependencyRule } from "./interface";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "this dependency is not allowed.";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new AllowedDependenciesRuleWalker(sourceFile, this.getOptions()));
  }
}

class AllowedDependenciesRuleWalker extends Lint.RuleWalker {
  public visitImportDeclaration(node: ts.ImportDeclaration) {
    const _options = this.getOptions();
    if (Array.isArray(_options) && Array.isArray(_options[0])) {
      const [options]: DependencyRule[][] = _options;

      const sourceInfo = <ts.SourceFile>node.parent;
      const sourceName = sourceInfo.fileName;

      const importInfo = node.moduleSpecifier;
      const moduleName = importInfo.getText().replace(/("|')/g, "");

      for (const rule of options) {
        const isTarget = isMatch(sourceName, rule.sources);
        if (!isTarget) break;
        const allowed = isMatch(moduleName, rule.imports);
        if (allowed) break;
        this.addFailureAt(importInfo.pos, importInfo.end, `${Rule.FAILURE_STRING} [${rule.name}]`);
      }
    }

    super.visitImportDeclaration(node);
  }
}

const options = {
  dot: true,
};
function isMatch(target: string, patterns: string[]) {
  for (const pattern of patterns) {
    if (minimatch(target, pattern, options)) return true;
  }

  return false;
}

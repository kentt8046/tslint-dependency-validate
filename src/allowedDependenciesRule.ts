import * as ts from "typescript";
import * as Lint from "tslint";

import { visitImportDeclaration } from "./util";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "this dependency is not allowed.";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new AllowedDependenciesRuleWalker(sourceFile, this.getOptions()));
  }
}

class AllowedDependenciesRuleWalker extends Lint.RuleWalker {
  public visitImportDeclaration(node: ts.ImportDeclaration) {
    visitImportDeclaration.call(this, node, Rule.FAILURE_STRING, true);
    super.visitImportDeclaration(node);
  }
}

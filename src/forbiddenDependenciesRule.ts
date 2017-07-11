import * as ts from "typescript";
import * as Lint from "tslint";

import { visitImportDeclaration } from "./util";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "this dependency is forbidden.";

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new ForbiddenDependenciesRuleWalker(sourceFile, this.getOptions()));
  }
}

class ForbiddenDependenciesRuleWalker extends Lint.RuleWalker {
  public visitImportDeclaration(node: ts.ImportDeclaration) {
    visitImportDeclaration.call(this, node, Rule.FAILURE_STRING);
    super.visitImportDeclaration(node);
  }
}

import * as ts from "typescript";
import * as Lint from "tslint";

import { visitImportDeclaration, getExpression } from "./util";

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = "this dependency is forbidden.";

  public static metadata: Lint.IRuleMetadata = {
    ruleName: "forbidden-dependencies",
    type: "maintainability",
    description: "rule of forbidden module in import or require",
    optionsDescription: "",
    options: null,
    typescriptOnly: false
  };

  public apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(new ForbiddenDependenciesRuleWalker(sourceFile, this.getOptions()));
  }
}

class ForbiddenDependenciesRuleWalker extends Lint.RuleWalker {
  public visitImportDeclaration(node: ts.ImportDeclaration) {
    try {
      const source = node.getSourceFile();
      const expression = getExpression(node);
      visitImportDeclaration.call(this, source, expression, Rule.FAILURE_STRING);
    } catch (err) {
      this.addFailureAtNode(node, "syntax error");
    }
    super.visitImportDeclaration(node);
  }

  public visitCallExpression(node: ts.CallExpression) {
    if (
      node.getText().startsWith("require(") ||
      node.getText().startsWith("import(")
    ) {
      try {
        const source = node.getSourceFile();
        const expression = getExpression(node);

        visitImportDeclaration.call(this, source, expression, Rule.FAILURE_STRING);
      } catch (err) {
        this.addFailureAtNode(node, "syntax error");
      }
    }
    super.visitCallExpression(node);
  }

  public visitNode(node: ts.Node) {
    if (node.kind === ts.SyntaxKind.ExportDeclaration) {
      try {
        const source = node.getSourceFile();
        const expression = getExpression(node);

        visitImportDeclaration.call(this, source, expression, Rule.FAILURE_STRING);
      } catch (err) {
        this.addFailureAtNode(node, "syntax error");
      }
    }
    super.visitNode(node);
  }

}

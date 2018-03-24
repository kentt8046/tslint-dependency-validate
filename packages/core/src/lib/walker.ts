import * as ts from "typescript";
import * as Lint from "tslint";

import { getWalkerInfo } from "./options";
import { evaluteRule, resolveExtends } from "./rule";

export function visitImportDeclaration(
  this: Lint.RuleWalker,
  source: ts.SourceFile,
  expression: ts.Expression,
  FAILURE_STRING: string,
) {
  const options = this.getOptions();

  const info = getWalkerInfo(
    source.fileName,
    Array.isArray(options) && options[0],
  );

  if (info) {
    const moduleName = expression.getText().replace(/("|')/g, "");

    for (const rule of resolveExtends(info.rules)) {
      const matched = evaluteRule({ ...info, moduleName }, rule);
      if (matched) continue;
      const start = expression.end - moduleName.length - 1;

      this.addFailureAt(
        start,
        moduleName.length,
        `${FAILURE_STRING} [${rule.name}]`,
      );
    }
  }
}

type IODeclaration = ts.ImportDeclaration | ts.ExportDeclaration;
export function getExpression(node: ts.Node) {
  if (
    node.kind === ts.SyntaxKind.ImportDeclaration ||
    node.kind === ts.SyntaxKind.ExportDeclaration
  ) {
    return (<IODeclaration>node).moduleSpecifier;
  } else if (node.kind === ts.SyntaxKind.CallExpression) {
    return (<ts.CallExpression>node).arguments[0];
  }
  throw new Error("unsupported kind.");
}

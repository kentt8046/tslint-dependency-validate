import { resolve } from "path";

import * as ts from "typescript";
import * as Lint from "tslint";

import { isBuiltinModule } from "./file";
import { isMatch } from "./match";
import { getWalkerInfo } from "./options";

function evaluteRule(info: ImportInfo, rule: DependencyRule) {
  const { rootDir, sourceDir, sourceName, moduleName } = info;

  let isTarget = isMatch(sourceName, rule.sources);
  if (Array.isArray(rule.excludeSources)) {
    isTarget = isTarget && !isMatch(sourceName, rule.excludeSources);
  }
  if (!isTarget) return 1;

  const hasImport = Array.isArray(rule.imports);
  if (Array.isArray(rule.imports)) {
    const matched = isMatch(moduleName, rule.imports);
    if (matched) return true;
  }

  if (Array.isArray(rule.resolvedImports)) {
    let moduleFullName;
    if (moduleName.startsWith(".")) {
      // relative import
      moduleFullName = resolve(sourceDir, moduleName);
    } else {
      // node module import
      moduleFullName = require.resolve(moduleName);
    }
    moduleFullName = moduleFullName.replace(`${rootDir}/`, "");

    const matched =
      (isBuiltinModule(moduleFullName) && !!rule.builtin) ||
      isMatch(moduleFullName, rule.resolvedImports);

    if (matched) return 3;

    return 0;
  }

  return hasImport && 4;
}

export function visitImportDeclaration(
  this: Lint.RuleWalker,
  source: ts.SourceFile,
  expression: ts.Expression,
  FAILURE_STRING: string,
) {
  const options = this.getOptions();

  const winfo = getWalkerInfo(
    source.fileName,
    Array.isArray(options) && options[0],
  );

  if (winfo) {
    const { rules, ...info } = winfo;
    const moduleName = expression.getText().replace(/("|')/g, "");

    for (const rule of rules) {
      const matched = evaluteRule({ ...info, moduleName }, rule);
      if (matched) break;
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

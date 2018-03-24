import * as path from "path";

import * as ts from "typescript";
import * as Lint from "tslint";

import { isNativeModule } from "./file";
import { isMatch } from "./match";
import { getWalkerInfo, WalkerInfo } from "./options";

interface ImportInfo extends WalkerInfo {
  moduleName: string;
}
function evaluteRule(info: ImportInfo, rule: DependencyRule) {
  const { rootDir, sourceDir, sourceName, moduleName } = info;

  // そもそもimportsがない -> チェックしない
  if (!rule.imports) return -1;

  // lint対象のファイルかどうか
  let isTarget = isMatch(sourceName, rule.sources);
  if (Array.isArray(rule.excludes)) {
    isTarget = isTarget && !isMatch(sourceName, rule.excludes);
  }
  if (!isTarget) return 1;

  return relativeImport(info, rule) || moduleImport(info, rule);
}

const relativeImport = (
  { moduleName, sourceDir, rootDir }: ImportInfo,
  { imports: { relative, resolve } }: DependencyRule,
) => {
  if (moduleName.startsWith(".")) {
    if (Array.isArray(relative) && isMatch(moduleName, relative)) {
      return 2;
    }

    const moduleFullName = path
      .resolve(sourceDir, moduleName)
      .replace(`${rootDir}/`, "");
    if (Array.isArray(resolve) && isMatch(moduleFullName, resolve)) {
      return 3;
    }
  }

  return 0;
};

const moduleImport = (
  { moduleName }: ImportInfo,
  { imports: { native, nodeModules } }: DependencyRule,
) => {
  if (isNativeModule(moduleName) && native) {
    return 4;
  } else if (Array.isArray(nodeModules) && isMatch(moduleName, nodeModules)) {
    return 5;
  }

  return 0;
};

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

    for (const rule of info.rules) {
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

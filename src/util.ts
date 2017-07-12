import { dirname, resolve } from "path";

import * as ts from "typescript";
import * as Lint from "tslint";
import * as minimatch from "minimatch";

import { searchNodeModules } from "./module";
import { DependencyRule, ImportInfo } from "./interface";

const rootDir = process.cwd();
const nodeModulesDirs = searchNodeModules(rootDir);
const paths = (<any>module).paths;
Object.assign((<any>module).paths, [
  ...nodeModulesDirs,
  ...paths,
]);

const options = {
  dot: true,
};
function isMatch(target: string, patterns: string[]) {
  for (const pattern of patterns) {
    if (minimatch(target, pattern, options)) return true;
  }

  return false;
}

const builtinModules = (() => {
  const blacklist = [
    "freelist",
    "sys"
  ];

  return Object.keys((<any>process).binding("natives")).filter(function (el) {
    return !/^_|^internal|\//.test(el) && blacklist.indexOf(el) === -1;
  }).sort();
})();
function isBuiltinModule(id: string) {
  return builtinModules.includes(id);
}

function evaluteRule(info: ImportInfo, rule: DependencyRule, _expect?: boolean) {
  const {
    rootDir,
    sourceDir,
    sourceName,
    moduleName,
  } = info;
  const expect = !!_expect;

  let isTarget = isMatch(sourceName, rule.sources);
  if (Array.isArray(rule.excludeSources)) {
    isTarget = isTarget && !isMatch(sourceName, rule.excludeSources);
  }
  if (!isTarget) return 1;

  const hasImport = Array.isArray(rule.imports);
  if (Array.isArray(rule.imports)) {
    const matched = isMatch(moduleName, rule.imports);
    if (matched) return expect;
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

    const matched = (
      (isBuiltinModule(moduleFullName) && !!rule.builtin) ||
      isMatch(moduleFullName, rule.resolvedImports)
    );

    if (expect === matched) return 3;

    return 0;
  }

  return hasImport ? !expect : 4;
}

export function visitImportDeclaration(
  this: Lint.RuleWalker,
  source: ts.SourceFile,
  expression: ts.Expression,
  FAILURE_STRING: string,
  expect?: boolean) {
  const _options = this.getOptions();
  if (Array.isArray(_options) && Array.isArray(_options[0])) {
    const [options]: DependencyRule[][] = _options;

    const moduleName = expression.getText().replace(/("|')/g, "");

    const info: ImportInfo = {
      rootDir,
      sourceName: source.fileName.replace(`${rootDir}/`, ""),
      sourceDir: dirname(source.fileName).replace(`${rootDir}/`, ""),
      moduleName,
    };

    for (const rule of options) {
      const matched = evaluteRule(info, rule, expect);
      if (matched) break;
      const start = expression.end - moduleName.length - 1;
      this.addFailureAt(start, moduleName.length, `${FAILURE_STRING} [${rule.name}]`);
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

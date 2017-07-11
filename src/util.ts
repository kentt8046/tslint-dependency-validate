import { dirname, resolve } from "path";

import * as ts from "typescript";
import * as Lint from "tslint";
import * as minimatch from "minimatch";

import { DependencyRule, ImportInfo } from "./interface";

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
  if (Array.isArray(rule.excludes)) {
    isTarget = isTarget && !isMatch(sourceName, rule.excludes);
  }
  if (!isTarget) return 1;

  if (Array.isArray(rule.imports)) {
    const matched = isMatch(moduleName, rule.imports);
    if (matched) return expect;
  }
  if (Array.isArray(rule.resolved)) {
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
      isMatch(moduleFullName, rule.resolved)
    );

    if (expect === matched) return 3;

    return 0;
  }

  return 4;
}

export function visitImportDeclaration(this: Lint.RuleWalker, node: ts.ImportDeclaration, FAILURE_STRING: string, expect?: boolean) {
  const _options = this.getOptions();
  if (Array.isArray(_options) && Array.isArray(_options[0])) {
    const [options]: DependencyRule[][] = _options;

    const rootDir = process.cwd();
    const sourceInfo = <ts.SourceFile>node.parent;
    const importInfo = node.moduleSpecifier;
    const moduleName = importInfo.getText().replace(/("|')/g, "");

    const info: ImportInfo = {
      rootDir,
      sourceName: sourceInfo.fileName.replace(`${rootDir}/`, ""),
      sourceDir: dirname(sourceInfo.fileName).replace(`${rootDir}/`, ""),
      moduleName,
    };

    for (const rule of options) {
      const matched = evaluteRule(info, rule, expect);
      if (matched) break;
      const start = importInfo.end - moduleName.length - 1;
      this.addFailureAt(start, moduleName.length, `${FAILURE_STRING} [${rule.name}]`);
    }
  }
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const ts = require("typescript");
const micromatch = require("micromatch");
const module_1 = require("./module");
const projectDir = process.cwd();
const nodeModulesDirs = module_1.searchNodeModules(projectDir);
const paths = module.paths;
Object.assign(module.paths, [...nodeModulesDirs, ...paths]);
const matchOptions = {
  dot: true,
};
function isMatch(target, patterns) {
  for (const pattern of patterns) {
    if (micromatch([target], pattern, matchOptions)) {
      return true;
    }
  }
  return false;
}
const blacklist = ["freelist", "sys"];
const builtinModules = Object.keys(process.binding("natives"))
  .filter(el => !/^_|^internal|\//.test(el) && blacklist.indexOf(el) === -1)
  .sort();
function isNativeModule(id) {
  return builtinModules.includes(id);
}
function evaluteRule(info, rule, _expect) {
  const { rootDir, sourceDir, sourceName, moduleName } = info;
  const expect = !!_expect;
  let isTarget = isMatch(sourceName, rule.sources);
  if (Array.isArray(rule.excludes)) {
    isTarget = isTarget && !isMatch(sourceName, rule.excludes);
  }
  if (!isTarget) return 1;
  const hasImport = Array.isArray(rule.imports);
  if (Array.isArray(rule.imports)) {
    const matched = isMatch(moduleName, rule.imports);
    if (matched) return expect;
  }
  if (Array.isArray(rule.resolve)) {
    let moduleFullName;
    if (moduleName.startsWith(".")) {
      // relative import
      moduleFullName = path_1.resolve(sourceDir, moduleName);
    } else {
      // node module import
      moduleFullName = require.resolve(moduleName);
    }
    moduleFullName = moduleFullName.replace(`${rootDir}/`, "");
    const matched =
      (isNativeModule(moduleFullName) && !!rule.builtin) ||
      isMatch(moduleFullName, rule.resolve);
    if (expect === matched) return 3;
    return 0;
  }
  return hasImport ? !expect : 4;
}
function visitImportDeclaration(source, expression, FAILURE_STRING, expect) {
  const _options = this.getOptions();
  if (Array.isArray(_options) && Array.isArray(_options[0])) {
    const [options] = _options;
    const moduleName = expression.getText().replace(/("|')/g, "");
    const info = {
      rootDir: projectDir,
      sourceName: source.fileName.replace(`${projectDir}/`, ""),
      sourceDir: path_1.dirname(source.fileName).replace(`${projectDir}/`, ""),
      moduleName,
    };
    for (const rule of options) {
      const matched = evaluteRule(info, rule, expect);
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
exports.visitImportDeclaration = visitImportDeclaration;
function getExpression(node) {
  if (
    node.kind === ts.SyntaxKind.ImportDeclaration ||
    node.kind === ts.SyntaxKind.ExportDeclaration
  ) {
    return node.moduleSpecifier;
  } else if (node.kind === ts.SyntaxKind.CallExpression) {
    return node.arguments[0];
  }
  throw new Error("unsupported kind.");
}
exports.getExpression = getExpression;
//# sourceMappingURL=util.js.map

import * as path from "path";

import { isNativeModule } from "./file";
import { isMatch } from "./match";
import { WalkerInfo } from "./options";

interface ImportInfo extends WalkerInfo {
  moduleName: string;
}
export const evaluteRule = (info: ImportInfo, rule: DependencyRule) => {
  const { sourceName } = info;

  // そもそもimportsがない -> チェックしない
  if (!rule.imports) return -1;

  // lint対象のファイルかどうか
  let isTarget = false;
  if (Array.isArray(rule.sources)) {
    isTarget = isMatch(sourceName, rule.sources);
  }
  if (isTarget && Array.isArray(rule.excludes)) {
    isTarget = !isMatch(sourceName, rule.excludes);
  }
  if (!isTarget) return 1;

  return relativeImport(info, rule) || moduleImport(info, rule);
};

const relativeImport = (
  { moduleName, sourceDir }: ImportInfo,
  { imports: { relative, resolve } }: DependencyRule,
) => {
  if (moduleName.startsWith(".")) {
    if (Array.isArray(relative) && isMatch(moduleName, relative)) {
      return 2;
    }

    const moduleFullName = sourceDir
      ? path.resolve(sourceDir, moduleName)
      : moduleName;
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

export const resolveExtends = (rules: DependencyRule[]): DependencyRule[] => {
  const ruleMap = rules.reduce<{ [name: string]: DependencyRule }>(
    (r, rule) => ({ ...r, [rule.name]: rule }),
    {},
  );

  const extend = ({ extends: x, ...rule }: DependencyRule): DependencyRule => {
    if (!x || !Array.isArray(x)) return rule;

    return x
      .map(name => ruleMap[name])
      .filter(r => r)
      .reduce<DependencyRule>((r, xRule) => {
        const {
          relative = [],
          resolve = [],
          native,
          nodeModules = [],
        } = extend(xRule).imports;

        return {
          ...r,
          imports: {
            relative: [...(r.imports.relative || []), ...relative],
            resolve: [...(r.imports.resolve || []), ...resolve],
            native: r.imports.native || native,
            nodeModules: [...(r.imports.nodeModules || []), ...nodeModules],
          },
        };
      }, rule);
  };

  return rules.map(extend);
};

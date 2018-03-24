import { parse } from "path";
import { readFileSync } from "fs";

import { searchTslintDir, getTsdvrcPath } from "./file";

export interface WalkerInfo {
  rules: DependencyRule[];
  sourceName: string;
  sourceDir: string;
}

export const getWalkerInfo = (
  source: PathString,
  options,
): WalkerInfo | null => {
  const rootDir = searchTslintDir(source);
  if (!rootDir) return null;

  const info = parse(source);
  if (Array.isArray(options)) {
    return {
      rules: options,
      sourceName: info.base,
      sourceDir: info.dir.replace(rootDir, ""),
    };
  }

  const tsdvrcFile = getTsdvrcPath(rootDir, options);
  if (!tsdvrcFile) return null;

  return {
    rules: JSON.parse(readFileSync(tsdvrcFile, "utf8")),
    sourceName: info.base,
    sourceDir: info.dir.replace(rootDir, ""),
  };
};

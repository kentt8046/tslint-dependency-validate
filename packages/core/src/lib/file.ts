import { readdirSync, statSync } from "fs";
import { resolve } from "path";

export const projectDir = process.cwd();
const nodeModulesDirs = searchNodeModules(projectDir);
const paths = module.paths;
Object.assign(module.paths, [...nodeModulesDirs, ...paths]);

const blacklist = ["freelist", "sys"];
const builtinModules = Object.keys((process as any).binding("natives"))
  .filter(el => !/^_|^internal|\//.test(el) && blacklist.indexOf(el) === -1)
  .sort();

export function isBuiltinModule(id: string) {
  return builtinModules.includes(id);
}

export function searchNodeModules(dir: string): string[] {
  const result: string[] = [];
  for (const nested of readdirSync(dir)) {
    const dirName = resolve(dir, nested);
    const stats = statSync(dirName);
    if (stats.isDirectory()) {
      if (dirName.endsWith("node_modules")) {
        result.push(dirName);
        continue;
      }
      const searchResult = searchNodeModules(dirName);
      result.push(...searchResult);
    }
  }

  return result;
}

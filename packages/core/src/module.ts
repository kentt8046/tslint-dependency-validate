import { readdirSync, statSync } from "fs";
import { resolve } from "path";

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

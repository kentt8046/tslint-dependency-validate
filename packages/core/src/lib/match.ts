import * as micromatch from "micromatch";

export function isMatch(target: string, patterns: string[]) {
  return patterns.some(pattern => micromatch.isMatch(target, pattern));
}

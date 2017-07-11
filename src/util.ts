import * as minimatch from "minimatch";

const options = {
  dot: true,
};
export function isMatch(target: string, patterns: string[]) {
  for (const pattern of patterns) {
    if (minimatch(target, pattern, options)) return true;
  }

  return false;
}

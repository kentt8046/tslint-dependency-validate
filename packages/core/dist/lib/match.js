"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const micromatch = require("micromatch");
function isMatch(target, patterns) {
    return patterns.some(pattern => micromatch.isMatch(target, pattern));
}
exports.isMatch = isMatch;
//# sourceMappingURL=match.js.map
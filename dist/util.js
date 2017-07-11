"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const minimatch = require("minimatch");
const options = {
    dot: true,
};
function isMatch(target, patterns) {
    for (const pattern of patterns) {
        if (minimatch(target, pattern, options))
            return true;
    }
    return false;
}
exports.isMatch = isMatch;
//# sourceMappingURL=util.js.map
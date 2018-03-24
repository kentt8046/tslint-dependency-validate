"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
function searchNodeModules(dir) {
    const result = [];
    for (const nested of fs_1.readdirSync(dir)) {
        const dirName = path_1.resolve(dir, nested);
        const stats = fs_1.statSync(dirName);
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
exports.searchNodeModules = searchNodeModules;
//# sourceMappingURL=module.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const Lint = require("tslint");
const TSDVRC_FILENAME = ".tsdvrc";
exports.projectDir = process.cwd();
const nodeModulesDirs = searchNodeModules(exports.projectDir);
const paths = module.paths;
Object.assign(module.paths, [...nodeModulesDirs, ...paths]);
const blacklist = ["freelist", "sys"];
const nativeModules = Object.keys(process.binding("natives"))
    .filter(el => !/^_|^internal|\//.test(el) && blacklist.indexOf(el) === -1)
    .sort();
function isNativeModule(id) {
    return nativeModules.includes(id);
}
exports.isNativeModule = isNativeModule;
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
exports.searchTslintDir = (source) => {
    const file = Lint.Configuration.findConfigurationPath(null, source);
    return file && path_1.parse(file).dir;
};
exports.getTsdvrcPath = (tslintDir, relative = "") => {
    try {
        const file = path_1.resolve(tslintDir, relative, TSDVRC_FILENAME);
        require.resolve(file);
        return file;
    }
    catch (_a) {
        return "";
    }
};
//# sourceMappingURL=file.js.map
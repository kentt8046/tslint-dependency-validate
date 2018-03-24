"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const file_1 = require("./file");
exports.getWalkerInfo = (source, options) => {
    const rootDir = file_1.searchTslintDir(source);
    if (!rootDir)
        return null;
    const info = path_1.parse(source);
    if (Array.isArray(options)) {
        return {
            rootDir,
            rules: options,
            sourceName: info.base,
            sourceDir: info.dir.replace(rootDir, ""),
        };
    }
    const tsdvrcFile = file_1.getTsdvrcPath(rootDir, options);
    if (!tsdvrcFile)
        return null;
    return {
        rootDir,
        rules: JSON.parse(fs_1.readFileSync(tsdvrcFile, "utf8")),
        sourceName: info.base,
        sourceDir: info.dir.replace(rootDir, ""),
    };
};
//# sourceMappingURL=options.js.map
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL21vZHVsZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJCQUEyQztBQUMzQywrQkFBK0I7QUFFL0IsMkJBQWtDLEdBQVc7SUFDM0MsTUFBTSxNQUFNLEdBQWEsRUFBRSxDQUFDO0lBQzVCLEdBQUcsQ0FBQyxDQUFDLE1BQU0sTUFBTSxJQUFJLGdCQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3RDLE1BQU0sT0FBTyxHQUFHLGNBQU8sQ0FBQyxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDckMsTUFBTSxLQUFLLEdBQUcsYUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ2hDLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDeEIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQ3JCLFFBQVEsQ0FBQztZQUNYLENBQUM7WUFDRCxNQUFNLFlBQVksR0FBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUNoRCxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUM7UUFDL0IsQ0FBQztJQUNILENBQUM7SUFFRCxNQUFNLENBQUMsTUFBTSxDQUFDO0FBQ2hCLENBQUM7QUFoQkQsOENBZ0JDIn0=
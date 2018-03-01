"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const Lint = require("tslint");
const util_1 = require("./util");
class Rule extends Lint.Rules.AbstractRule {
    apply(sourceFile) {
        return this.applyWithWalker(new AllowedDependenciesRuleWalker(sourceFile, this.getOptions()));
    }
}
Rule.FAILURE_STRING = "this dependency is not allowed.";
Rule.metadata = {
    ruleName: "allowed-dependencies",
    type: "maintainability",
    description: "rule of allowed module in import or require",
    optionsDescription: "",
    options: null,
    typescriptOnly: false,
};
exports.Rule = Rule;
class AllowedDependenciesRuleWalker extends Lint.RuleWalker {
    visitImportDeclaration(node) {
        try {
            const source = node.getSourceFile();
            const expression = util_1.getExpression(node);
            util_1.visitImportDeclaration.call(this, source, expression, Rule.FAILURE_STRING, true);
        }
        catch (err) {
            this.addFailureAtNode(node, "syntax error");
        }
        super.visitImportDeclaration(node);
    }
    visitCallExpression(node) {
        const funcName = node.expression.getText();
        if (funcName === "require" || funcName === "import") {
            try {
                const source = node.getSourceFile();
                const expression = util_1.getExpression(node);
                util_1.visitImportDeclaration.call(this, source, expression, Rule.FAILURE_STRING, true);
            }
            catch (err) {
                this.addFailureAtNode(node, "syntax error");
            }
        }
        super.visitCallExpression(node);
    }
    visitNode(node) {
        if (node.kind === ts.SyntaxKind.ExportDeclaration) {
            try {
                const source = node.getSourceFile();
                const expression = util_1.getExpression(node);
                util_1.visitImportDeclaration.call(this, source, expression, Rule.FAILURE_STRING, true);
            }
            catch (err) {
                this.addFailureAtNode(node, "syntax error");
            }
        }
        super.visitNode(node);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWxsb3dlZERlcGVuZGVuY2llc1J1bGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvYWxsb3dlZERlcGVuZGVuY2llc1J1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxpQ0FBaUM7QUFDakMsK0JBQStCO0FBRS9CLGlDQUErRDtBQUUvRCxVQUFrQixTQUFRLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWTtJQVl4QyxLQUFLLENBQUMsVUFBeUI7UUFDcEMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLENBQ3pCLElBQUksNkJBQTZCLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUNqRSxDQUFDO0lBQ0osQ0FBQzs7QUFmYSxtQkFBYyxHQUFHLGlDQUFpQyxDQUFDO0FBRW5ELGFBQVEsR0FBdUI7SUFDM0MsUUFBUSxFQUFFLHNCQUFzQjtJQUNoQyxJQUFJLEVBQUUsaUJBQWlCO0lBQ3ZCLFdBQVcsRUFBRSw2Q0FBNkM7SUFDMUQsa0JBQWtCLEVBQUUsRUFBRTtJQUN0QixPQUFPLEVBQUUsSUFBSTtJQUNiLGNBQWMsRUFBRSxLQUFLO0NBQ3RCLENBQUM7QUFWSixvQkFpQkM7QUFFRCxtQ0FBb0MsU0FBUSxJQUFJLENBQUMsVUFBVTtJQUNsRCxzQkFBc0IsQ0FBQyxJQUEwQjtRQUN0RCxJQUFJLENBQUM7WUFDSCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7WUFDcEMsTUFBTSxVQUFVLEdBQUcsb0JBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2Qyw2QkFBc0IsQ0FBQyxJQUFJLENBQ3pCLElBQUksRUFDSixNQUFNLEVBQ04sVUFBVSxFQUNWLElBQUksQ0FBQyxjQUFjLEVBQ25CLElBQUksQ0FDTCxDQUFDO1FBQ0osQ0FBQztRQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDYixJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQzlDLENBQUM7UUFDRCxLQUFLLENBQUMsc0JBQXNCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVNLG1CQUFtQixDQUFDLElBQXVCO1FBQ2hELE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDM0MsRUFBRSxDQUFDLENBQUMsUUFBUSxLQUFLLFNBQVMsSUFBSSxRQUFRLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQztZQUNwRCxJQUFJLENBQUM7Z0JBQ0gsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNwQyxNQUFNLFVBQVUsR0FBRyxvQkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUV2Qyw2QkFBc0IsQ0FBQyxJQUFJLENBQ3pCLElBQUksRUFDSixNQUFNLEVBQ04sVUFBVSxFQUNWLElBQUksQ0FBQyxjQUFjLEVBQ25CLElBQUksQ0FDTCxDQUFDO1lBQ0osQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQztZQUM5QyxDQUFDO1FBQ0gsQ0FBQztRQUNELEtBQUssQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRU0sU0FBUyxDQUFDLElBQWE7UUFDNUIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsVUFBVSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUM7Z0JBQ0gsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO2dCQUNwQyxNQUFNLFVBQVUsR0FBRyxvQkFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUV2Qyw2QkFBc0IsQ0FBQyxJQUFJLENBQ3pCLElBQUksRUFDSixNQUFNLEVBQ04sVUFBVSxFQUNWLElBQUksQ0FBQyxjQUFjLEVBQ25CLElBQUksQ0FDTCxDQUFDO1lBQ0osQ0FBQztZQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQztZQUM5QyxDQUFDO1FBQ0gsQ0FBQztRQUNELEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDeEIsQ0FBQztDQUNGIn0=
type GlobString = string;
type PathString = string | GlobString;
type RuleName = string;
type ModuleName = string;

interface DependencyRule {
  name: RuleName;
  sources?: PathString[];
  extends?: RuleName[];
  excludes?: PathString[];
  imports: {
    relative?: PathString[];
    resolve?: PathString[];
    nodeModules?: ModuleName[];
    native?: boolean;
  };
}

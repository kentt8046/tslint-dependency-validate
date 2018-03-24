interface DependencyRule {
  name: string;
  sources: string[];
  imports?: string[];
  excludeSources?: string[];
  resolvedImports?: string[];
  builtin?: boolean;
}

interface ImportInfo {
  rootDir: string;

  sourceName: string;
  sourceDir: string;

  moduleName: string;
}

type GlobString = string;
type PathString = string | GlobString;
type RuleName = string;
type ModuleName = string;

interface Rule {
  name: RuleName;
  sources: PathString[];
  extends?: RuleName[];
  excludes?: PathString[];
  imports: {
    relative?: PathString[];
    resolve?: PathString[];
    nodeModules?: ModuleName[];
    buildin?: boolean;
  };
}

import { Expression } from "typescript";

export interface DependencyRule {
  name: string;
  sources: string[];
  imports?: string[];
  excludeSources?: string[];
  resolvedImports?: string[];
  builtin?: boolean;
}

export interface ImportInfo {
  rootDir: string;

  sourceName: string;
  sourceDir: string;

  moduleName: string;
}

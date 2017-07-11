import { Expression } from "typescript";

export interface DependencyRule {
  name: string;
  sources: string[];
  imports?: string[];
  excludes?: string[];
  resolved?: string[];
  builtin?: boolean;
}

export interface ImportInfo {
  rootDir: string;

  sourceName: string;
  sourceDir: string;

  moduleName: string;
}

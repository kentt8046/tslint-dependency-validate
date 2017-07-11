export interface DependencyRule {
  name: string;
  sources: string[];
  imports: string[];
  excludes?: string[];
}

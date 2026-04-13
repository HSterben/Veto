export interface ProjectBlueprint {
  id: string;
  ideaId: string;
  overview: string;
  problem: string;
  audience: string;
  features: FeatureItem[];
  architecture: ArchitectureBlock;
  schema: SchemaTable[];
  pages: PageDefinition[];
  apiRoutes: ApiRoute[];
  roadmap: RoadmapPhase[];
  stretchGoals: string[];
  designDirection: string;
  createdAt: string;
}

export interface FeatureItem {
  name: string;
  description: string;
  priority: "mvp" | "stretch";
}

export interface ArchitectureBlock {
  overview: string;
  components: { name: string; description: string; tech: string }[];
  diagram: string;
}

export interface SchemaTable {
  name: string;
  columns: { name: string; type: string; constraints: string }[];
}

export interface PageDefinition {
  route: string;
  name: string;
  description: string;
  components: string[];
}

export interface ApiRoute {
  method: string;
  path: string;
  description: string;
  requestBody?: string;
  response: string;
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  tasks: string[];
  duration: string;
}

export type RecipeKey =
  | "audience"
  | "positioning"
  | "copy"
  | "pitch"
  | "funding";

export interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

export interface GenerationOutput {
  recipe: RecipeKey;
  content: string;
  generatedAt: number;
}

export interface FundingMatch {
  name: string;
  type: string;
  focusKeywords: string[];
  description: string;
  url?: string;
  score?: number;
}

export interface Project {
  id: string;
  name: string;
  idea: string;
  audience: string;
  competitorContext: string;
  outputs: Partial<Record<RecipeKey, GenerationOutput>>;
  checklist: ChecklistItem[];
  fundingMatches: FundingMatch[];
  createdAt: number;
  updatedAt: number;
}

export interface GenerateRequestBody {
  recipe: RecipeKey;
  idea: string;
  audience?: string;
  competitorContext?: string;
  previous?: string;
  refinement?: string;
}

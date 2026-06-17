export interface RecommendationRequest {
  currentCpu: string;
  currentGpu: string;
  currentRamGb: number;
  currentStorage: string;
  currentPsuWatts?: number;
  budget: number;
  useCase: string;
  targetResolution: string;
  notes: string;
}

export interface RecommendationResponse {
  summary: string;
  recommendedUpgradeCategory: string;
  reasoning: string[];
  nextSteps: string[];
}

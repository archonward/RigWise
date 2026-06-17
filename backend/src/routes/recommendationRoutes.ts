import { Router } from 'express';
import type { Request, Response } from 'express';
import type {
  RecommendationRequest,
  RecommendationResponse,
} from '../types/recommendation';

const recommendationRouter = Router();

function isPositiveNumber(value: unknown) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0;
}

function validateRecommendationRequest(body: Partial<RecommendationRequest>) {
  if (!isPositiveNumber(body.budget)) {
    return 'Budget must be a positive number.';
  }

  if (!isPositiveNumber(body.currentRamGb)) {
    return 'Current RAM must be a positive number.';
  }

  if (
    body.currentPsuWatts !== undefined &&
    body.currentPsuWatts !== null &&
    !isPositiveNumber(body.currentPsuWatts)
  ) {
    return 'Current PSU wattage must be a positive number when provided.';
  }

  if (typeof body.useCase !== 'string' || body.useCase.trim() === '') {
    return 'Use case is required.';
  }

  return null;
}

function buildPlaceholderRecommendation(
  requestData: RecommendationRequest,
): RecommendationResponse {
  const normalizedUseCase = requestData.useCase.trim().toLowerCase();
  const normalizedResolution = requestData.targetResolution.trim().toLowerCase();
  const normalizedStorage = requestData.currentStorage.trim().toLowerCase();

  if (requestData.budget < 150) {
    return {
      summary:
        'Your current budget is quite tight, so the best next step is to save a bit more before making an upgrade.',
      recommendedUpgradeCategory: 'Budget',
      reasoning: [
        'Budgets below $150 often limit you to very small performance gains.',
        'Saving more gives you access to more meaningful upgrade options.',
        'Waiting can help you avoid buying a part you will outgrow quickly.',
      ],
      nextSteps: [
        'Increase the upgrade budget if possible.',
        'Keep an eye on parts prices and sales.',
        'Focus on the component that is currently holding back your system the most.',
      ],
    };
  }

  if (requestData.currentRamGb < 16) {
    return {
      summary:
        'A RAM upgrade is likely the easiest first step because your current memory capacity is below a comfortable modern baseline.',
      recommendedUpgradeCategory: 'RAM',
      reasoning: [
        'Less than 16GB of RAM can limit performance in newer games and multitasking workloads.',
        'A memory upgrade is often simple and relatively cost-effective.',
        'More RAM can improve overall responsiveness even before a larger platform upgrade.',
      ],
      nextSteps: [
        'Check how many RAM slots are already in use.',
        'Match the memory type and supported speeds on your motherboard.',
        'Compare the cost of adding more RAM versus replacing the current kit.',
      ],
    };
  }

  if (normalizedStorage.includes('hdd')) {
    return {
      summary:
        'Storage is a strong upgrade candidate because moving away from an HDD can improve everyday responsiveness immediately.',
      recommendedUpgradeCategory: 'Storage',
      reasoning: [
        'Hard drives are much slower than modern SSDs for system responsiveness and game load times.',
        'A storage upgrade often has a very noticeable impact on daily use.',
        'This can be a practical first upgrade even on older systems.',
      ],
      nextSteps: [
        'Compare SATA and NVMe SSD options that fit your system.',
        'Check motherboard storage support before buying.',
        'Plan how you want to migrate Windows and important files.',
      ],
    };
  }

  if (
    normalizedUseCase === 'gaming' &&
    (normalizedResolution === '1440p' || normalizedResolution === '4k')
  ) {
    return {
      summary:
        'Based on your current build and goals, your GPU is likely the best first upgrade.',
      recommendedUpgradeCategory: 'GPU',
      reasoning: [
        `${requestData.useCase} performance is usually more GPU-dependent, especially at ${requestData.targetResolution}.`,
        'Your budget is enough to consider a meaningful graphics card upgrade.',
        'Your current PSU wattage should be checked before purchasing a higher-power GPU.',
      ],
      nextSteps: [
        'Compare GPUs within your budget.',
        'Check power supply requirements.',
        'Check case clearance before buying.',
      ],
    };
  }

  return {
    summary:
      'A GPU upgrade is the default recommendation because it often provides the most noticeable performance lift for many common PC workloads.',
    recommendedUpgradeCategory: 'GPU',
    reasoning: [
      'Graphics performance is a common upgrade bottleneck in many consumer PC builds.',
      'Your budget suggests you may be able to make a meaningful GPU upgrade.',
      'This is a good placeholder starting point until more advanced recommendation logic is added.',
    ],
    nextSteps: [
      'Compare GPU options in your price range.',
      'Double-check PSU wattage and connectors.',
      'Review case space and cooling before buying.',
    ],
  };
}

recommendationRouter.post('/', (request: Request, response: Response) => {
  const requestBody = request.body as Partial<RecommendationRequest>;
  const validationError = validateRecommendationRequest(requestBody);

  if (validationError) {
    response.status(400).json({
      message: validationError,
    });
    return;
  }

  const recommendation = buildPlaceholderRecommendation(
    requestBody as RecommendationRequest,
  );

  response.json(recommendation);
});

export default recommendationRouter;

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import SuggestedParts from './SuggestedParts';
import type { Part } from '../types/part';
import type {
  RecommendationRequest,
  RecommendationResponse,
} from '../types/recommendation';

const initialFormData: RecommendationRequest = {
  currentCpu: 'AMD Ryzen 5 3600',
  currentGpu: 'NVIDIA GTX 1660 Super',
  currentRamGb: 16,
  currentStorage: '500GB SSD',
  currentPsuWatts: 550,
  budget: 500,
  useCase: 'Gaming',
  targetResolution: '1440p',
  notes: 'I want better FPS in modern games',
};

function UpgradePlanner() {
  const [formData, setFormData] =
    useState<RecommendationRequest>(initialFormData);
  const [recommendation, setRecommendation] =
    useState<RecommendationResponse | null>(null);
  const [suggestedParts, setSuggestedParts] = useState<Part[]>([]);
  const [suggestionMessage, setSuggestionMessage] = useState('');
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadSuggestedParts() {
      if (!recommendation?.recommendedUpgradeCategory) {
        setSuggestedParts([]);
        setSuggestionMessage('');
        return;
      }

      setIsLoadingSuggestions(true);
      setSuggestionMessage('');

      try {
        const category = encodeURIComponent(
          recommendation.recommendedUpgradeCategory,
        );
        const response = await fetch(
          `http://localhost:3001/api/parts?category=${category}`,
        );

        if (!response.ok) {
          throw new Error('Failed to load suggested parts.');
        }

        const parts: Part[] = await response.json();
        const withinBudget = parts.filter((part) => part.price <= formData.budget);

        if (withinBudget.length > 0) {
          const rankedParts = [...withinBudget].sort(
            (firstPart, secondPart) =>
              secondPart.performanceScore - firstPart.performanceScore,
          );
          setSuggestedParts(rankedParts.slice(0, 3));
          return;
        }

        const cheapestParts = [...parts]
          .sort((firstPart, secondPart) => firstPart.price - secondPart.price)
          .slice(0, 3);

        setSuggestedParts(cheapestParts);
        setSuggestionMessage(
          'No parts in this category are within your budget yet. Here are the cheapest options to consider.',
        );
      } catch (error) {
        console.error(error);
        setSuggestedParts([]);
        setSuggestionMessage('Could not load suggested parts right now.');
      } finally {
        setIsLoadingSuggestions(false);
      }
    }

    void loadSuggestedParts();
  }, [recommendation, formData.budget]);

  function updateField<K extends keyof RecommendationRequest>(
    field: K,
    value: RecommendationRequest[K],
  ) {
    setFormData((currentData) => ({
      ...currentData,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setRecommendation(null);
    setSuggestedParts([]);
    setSuggestionMessage('');

    try {
      const response = await fetch('http://localhost:3001/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        const message =
          typeof responseData.message === 'string'
            ? responseData.message
            : 'Could not generate a recommendation.';

        throw new Error(message);
      }

      setRecommendation(responseData as RecommendationResponse);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Could not reach the backend recommendation service.',
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="upgrade-planner" className="border-t border-white/10 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
            Upgrade Planner
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Plan Your Next Upgrade
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Tell RigWise about your current PC, your budget, and what you want
            to improve. For now, the backend returns a simple placeholder
            recommendation so the full flow is in place.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <form
            onSubmit={handleSubmit}
            className="rounded-lg border border-white/10 bg-slate-900/70 p-6"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  Current CPU
                </span>
                <input
                  type="text"
                  value={formData.currentCpu}
                  onChange={(event) => updateField('currentCpu', event.target.value)}
                  className="w-full rounded-md border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  Current GPU
                </span>
                <input
                  type="text"
                  value={formData.currentGpu}
                  onChange={(event) => updateField('currentGpu', event.target.value)}
                  className="w-full rounded-md border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  Current RAM in GB
                </span>
                <input
                  type="number"
                  min="1"
                  value={formData.currentRamGb}
                  onChange={(event) =>
                    updateField('currentRamGb', Number(event.target.value))
                  }
                  className="w-full rounded-md border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  Current storage
                </span>
                <input
                  type="text"
                  value={formData.currentStorage}
                  onChange={(event) =>
                    updateField('currentStorage', event.target.value)
                  }
                  className="w-full rounded-md border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  Current PSU wattage
                </span>
                <input
                  type="number"
                  min="1"
                  value={formData.currentPsuWatts ?? ''}
                  onChange={(event) =>
                    updateField(
                      'currentPsuWatts',
                      event.target.value ? Number(event.target.value) : undefined,
                    )
                  }
                  className="w-full rounded-md border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  Budget
                </span>
                <input
                  type="number"
                  min="1"
                  value={formData.budget}
                  onChange={(event) => updateField('budget', Number(event.target.value))}
                  className="w-full rounded-md border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  Use case
                </span>
                <select
                  value={formData.useCase}
                  onChange={(event) => updateField('useCase', event.target.value)}
                  className="w-full rounded-md border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                >
                  <option value="Gaming">Gaming</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Video Editing">Video Editing</option>
                  <option value="Streaming">Streaming</option>
                  <option value="General Use">General Use</option>
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">
                  Target resolution
                </span>
                <select
                  value={formData.targetResolution}
                  onChange={(event) =>
                    updateField('targetResolution', event.target.value)
                  }
                  className="w-full rounded-md border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                >
                  <option value="1080p">1080p</option>
                  <option value="1440p">1440p</option>
                  <option value="4K">4K</option>
                  <option value="Not sure">Not sure</option>
                </select>
              </label>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-medium text-slate-200">
                Notes
              </span>
              <textarea
                rows={4}
                value={formData.notes}
                onChange={(event) => updateField('notes', event.target.value)}
                className="w-full rounded-md border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
              />
            </label>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center rounded-md bg-cyan-400 px-5 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Generating Recommendation...' : 'Get Recommendation'}
              </button>

              {errorMessage ? (
                <p className="text-sm text-rose-200">{errorMessage}</p>
              ) : null}
            </div>
          </form>

          <div className="rounded-lg border border-white/10 bg-slate-900/70 p-6">
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
              Recommendation
            </p>

            {isSubmitting ? (
              <div className="mt-4 rounded-md border border-white/10 bg-slate-950 p-5 text-slate-300">
                Checking your build details...
              </div>
            ) : null}

            {!isSubmitting && recommendation ? (
              <div className="mt-4 space-y-6">
                <div className="rounded-md border border-white/10 bg-slate-950 p-5">
                  <p className="text-sm text-slate-400">Summary</p>
                  <p className="mt-2 text-base leading-7 text-slate-100">
                    {recommendation.summary}
                  </p>
                </div>

                <div className="rounded-md border border-white/10 bg-slate-950 p-5">
                  <p className="text-sm text-slate-400">
                    Recommended upgrade category
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-white">
                    {recommendation.recommendedUpgradeCategory}
                  </p>
                </div>

                <div className="rounded-md border border-white/10 bg-slate-950 p-5">
                  <p className="text-sm text-slate-400">Reasoning</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-100">
                    {recommendation.reasoning.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-md border border-white/10 bg-slate-950 p-5">
                  <p className="text-sm text-slate-400">Next steps</p>
                  <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-100">
                    {recommendation.nextSteps.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>

                {isLoadingSuggestions ? (
                  <div className="rounded-md border border-white/10 bg-slate-950 p-5 text-slate-300">
                    Finding matching parts...
                  </div>
                ) : null}

                {!isLoadingSuggestions && suggestionMessage && suggestedParts.length === 0 ? (
                  <div className="rounded-md border border-amber-300/30 bg-amber-300/10 p-5 text-amber-100">
                    {suggestionMessage}
                  </div>
                ) : null}

                {!isLoadingSuggestions && suggestedParts.length > 0 ? (
                  <SuggestedParts
                    parts={suggestedParts}
                    message={suggestionMessage}
                  />
                ) : null}
              </div>
            ) : null}

            {!isSubmitting && !recommendation ? (
              <div className="mt-4 rounded-md border border-white/10 bg-slate-950 p-5 text-slate-300">
                Submit the form to receive a placeholder upgrade recommendation
                from the backend.
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}

export default UpgradePlanner;

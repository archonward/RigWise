import type { Part } from '../types/part';

interface CompareTrayProps {
  selectedParts: Part[];
  onRemovePart: (partId: number) => void;
  onClearCompare: () => void;
}

function findHighest(
  selectedParts: Part[],
  getScore: (part: Part) => number,
) {
  return selectedParts.reduce<Part | null>((bestPart, currentPart) => {
    if (!bestPart) {
      return currentPart;
    }

    return getScore(currentPart) > getScore(bestPart) ? currentPart : bestPart;
  }, null);
}

function findLowestPrice(selectedParts: Part[]) {
  return selectedParts.reduce<Part | null>((lowestPart, currentPart) => {
    if (!lowestPart) {
      return currentPart;
    }

    return currentPart.price < lowestPart.price ? currentPart : lowestPart;
  }, null);
}

function getValueScore(part: Part) {
  return part.price > 0 ? part.performanceScore / part.price : 0;
}

function CompareTray({
  selectedParts,
  onRemovePart,
  onClearCompare,
}: CompareTrayProps) {
  if (selectedParts.length === 0) {
    return null;
  }

  const bestPerformance = findHighest(
    selectedParts,
    (part) => part.performanceScore,
  );
  const lowestPrice = findLowestPrice(selectedParts);
  const bestValue = findHighest(selectedParts, getValueScore);

  return (
    <div className="mt-8 rounded-lg border border-cyan-300/30 bg-slate-950/90 p-5 shadow-xl shadow-slate-950/30">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
            Compare Tray
          </p>
          <h3 className="mt-1 text-2xl font-semibold text-white">
            {selectedParts.length} selected
          </h3>
        </div>

        <button
          type="button"
          onClick={onClearCompare}
          className="rounded-md border border-white/10 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/50 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
        >
          Clear Compare
        </button>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {selectedParts.map((part) => (
          <article
            key={part.id}
            className="rounded-md border border-white/10 bg-slate-900 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-cyan-300">{part.brand}</p>
                <h4 className="mt-1 font-semibold text-white">{part.name}</h4>
              </div>
              <button
                type="button"
                onClick={() => onRemovePart(part.id)}
                className="rounded-md border border-white/10 px-2 py-1 text-xs font-semibold text-slate-200 transition hover:border-rose-300/50 hover:bg-rose-400/10 hover:text-rose-100"
              >
                Remove
              </button>
            </div>

            <dl className="mt-4 space-y-2 text-sm text-slate-300">
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Category</dt>
                <dd className="text-right text-slate-100">{part.category}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Price</dt>
                <dd className="text-right text-slate-100">${part.price}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Performance</dt>
                <dd className="text-right text-slate-100">
                  {part.performanceScore}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-slate-400">Power draw</dt>
                <dd className="text-right text-slate-100">
                  {part.powerDraw !== null ? `${part.powerDraw}W` : 'N/A'}
                </dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-100 md:grid-cols-3">
        <div className="rounded-md bg-cyan-400/10 p-3">
          Best performance: {bestPerformance?.name}
        </div>
        <div className="rounded-md bg-emerald-400/10 p-3">
          Lowest price: {lowestPrice?.name}
        </div>
        <div className="rounded-md bg-amber-400/10 p-3">
          Best value: {bestValue?.name}
        </div>
      </div>
    </div>
  );
}

export default CompareTray;

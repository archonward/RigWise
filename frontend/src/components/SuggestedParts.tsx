import type { Part } from '../types/part';

interface SuggestedPartsProps {
  parts: Part[];
  message?: string;
}

function SuggestedParts({ parts, message }: SuggestedPartsProps) {
  if (parts.length === 0) {
    return null;
  }

  return (
    <div className="rounded-md border border-white/10 bg-slate-950 p-5">
      <p className="text-sm text-slate-400">Suggested parts</p>

      {message ? (
        <p className="mt-3 rounded-md border border-amber-300/20 bg-amber-300/10 p-3 text-sm text-amber-100">
          {message}
        </p>
      ) : null}

      <div className="mt-4 space-y-3">
        {parts.map((part) => (
          <article
            key={part.id}
            className="rounded-md border border-white/10 bg-slate-900 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-cyan-300">
                  {part.brand}
                </p>
                <h4 className="mt-1 font-semibold text-white">{part.name}</h4>
              </div>
              <span className="rounded-full border border-white/10 bg-slate-950 px-3 py-1 text-xs font-semibold text-slate-300">
                ${part.price}
              </span>
            </div>

            <div className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-md bg-slate-950 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Performance
                </p>
                <p className="mt-1 font-semibold text-white">
                  {part.performanceScore}
                </p>
              </div>
              <div className="rounded-md bg-slate-950 p-3">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  Notes
                </p>
                <p className="mt-1 text-slate-100">
                  {part.notes || 'No notes available.'}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default SuggestedParts;

import { useEffect, useState } from 'react';
import type { Part } from '../types/part';

const categoryOptions = [
  'All',
  'CPU',
  'GPU',
  'RAM',
  'Motherboard',
  'PSU',
  'Storage',
  'Case',
  'Cooler',
] as const;

function PartsBrowser() {
  const [parts, setParts] = useState<Part[]>([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadParts() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const params = new URLSearchParams();

        if (selectedCategory !== 'All') {
          params.set('category', selectedCategory);
        }

        if (searchText.trim()) {
          params.set('search', searchText.trim());
        }

        const queryString = params.toString();
        const url = queryString
          ? `http://localhost:3001/api/parts?${queryString}`
          : 'http://localhost:3001/api/parts';

        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Failed to load parts from the backend.');
        }

        const data: Part[] = await response.json();
        setParts(data);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          'Could not load PC parts. Make sure the backend is running on http://localhost:3001.',
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadParts();
  }, [searchText, selectedCategory]);

  function clearFilters() {
    setSearchText('');
    setSelectedCategory('All');
  }

  return (
    <section
      id="parts-browser"
      className="border-t border-white/10 bg-slate-900/70 py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
            Parts Database
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Browse PC Parts
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Explore sample components from the local RigWise database. Use search
            and category filters to narrow the list quickly.
          </p>
        </div>

        <div className="mt-10 grid gap-4 rounded-lg border border-white/10 bg-slate-950/70 p-4 sm:grid-cols-[minmax(0,1fr)_220px_auto]">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">
              Search by name or brand
            </span>
            <input
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="Try Ryzen, NVIDIA, Corsair..."
              className="w-full rounded-md border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">
              Category
            </span>
            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="w-full rounded-md border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
            >
              {categoryOptions.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>

          <div className="flex items-end">
            <button
              type="button"
              onClick={clearFilters}
              className="w-full rounded-md border border-white/10 bg-slate-900 px-4 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-300/20 sm:w-auto"
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div className="mt-8">
          {isLoading ? (
            <div className="rounded-lg border border-white/10 bg-slate-950/70 p-6 text-slate-300">
              Loading parts...
            </div>
          ) : null}

          {!isLoading && errorMessage ? (
            <div className="rounded-lg border border-rose-400/30 bg-rose-400/10 p-6 text-rose-100">
              {errorMessage}
            </div>
          ) : null}

          {!isLoading && !errorMessage && parts.length === 0 ? (
            <div className="rounded-lg border border-white/10 bg-slate-950/70 p-6 text-slate-300">
              No parts matched the current filters.
            </div>
          ) : null}

          {!isLoading && !errorMessage && parts.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {parts.map((part) => (
                <article
                  key={part.id}
                  className="rounded-lg border border-white/10 bg-slate-950 p-6 shadow-lg shadow-slate-950/20"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-cyan-300">
                        {part.brand}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold text-white">
                        {part.name}
                      </h3>
                    </div>
                    <span className="rounded-full border border-white/10 bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-300">
                      {part.category}
                    </span>
                  </div>

                  <div className="mt-6 grid grid-cols-2 gap-3 text-sm text-slate-300">
                    <div className="rounded-md bg-slate-900 p-3">
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Price
                      </p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        ${part.price}
                      </p>
                    </div>
                    <div className="rounded-md bg-slate-900 p-3">
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        Performance
                      </p>
                      <p className="mt-1 text-lg font-semibold text-white">
                        {part.performanceScore}
                      </p>
                    </div>
                  </div>

                  <dl className="mt-6 space-y-3 text-sm text-slate-300">
                    {part.powerDraw !== null ? (
                      <div className="flex justify-between gap-4 border-t border-white/5 pt-3">
                        <dt className="text-slate-400">Power draw</dt>
                        <dd className="text-right text-slate-100">
                          {part.powerDraw}W
                        </dd>
                      </div>
                    ) : null}

                    {part.socket ? (
                      <div className="flex justify-between gap-4 border-t border-white/5 pt-3">
                        <dt className="text-slate-400">Socket</dt>
                        <dd className="text-right text-slate-100">{part.socket}</dd>
                      </div>
                    ) : null}

                    {part.memoryType ? (
                      <div className="flex justify-between gap-4 border-t border-white/5 pt-3">
                        <dt className="text-slate-400">Memory type</dt>
                        <dd className="text-right text-slate-100">
                          {part.memoryType}
                        </dd>
                      </div>
                    ) : null}

                    {part.notes ? (
                      <div className="border-t border-white/5 pt-3">
                        <dt className="text-slate-400">Notes</dt>
                        <dd className="mt-1 text-slate-100">{part.notes}</dd>
                      </div>
                    ) : null}
                  </dl>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default PartsBrowser;

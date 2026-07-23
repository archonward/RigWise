const benchmarkRows = [
  {
    name: 'Flagship GPU',
    tier: 'Enthusiast',
    resolution: '4K',
    fps: 'TBD',
    rayTracing: 'TBD',
    power: 'TBD',
    value: 'TBD',
  },
  {
    name: 'High-End GPU',
    tier: 'Performance',
    resolution: '1440p / 4K',
    fps: 'TBD',
    rayTracing: 'TBD',
    power: 'TBD',
    value: 'TBD',
  },
  {
    name: 'Mainstream GPU',
    tier: 'Balanced',
    resolution: '1080p / 1440p',
    fps: 'TBD',
    rayTracing: 'TBD',
    power: 'TBD',
    value: 'TBD',
  },
  {
    name: 'Entry GPU',
    tier: 'Budget',
    resolution: '1080p',
    fps: 'TBD',
    rayTracing: 'TBD',
    power: 'TBD',
    value: 'TBD',
  },
];

const metricCards = [
  {
    label: 'Average FPS',
    value: 'TBD',
    detail: 'Raster gaming score',
  },
  {
    label: 'Ray Tracing',
    value: 'TBD',
    detail: 'RT-heavy game score',
  },
  {
    label: 'Power Draw',
    value: 'TBD',
    detail: 'Typical gaming load',
  },
  {
    label: 'Value Score',
    value: 'TBD',
    detail: 'Performance per dollar',
  },
];

const workloadTabs = ['Gaming', 'Ray Tracing', 'Creator', 'Efficiency'];
const resolutionFilters = ['1080p', '1440p', '4K'];

function GpuBenchmarks() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <nav className="flex flex-wrap items-center justify-between gap-4">
            <a
              href="/"
              className="text-xl font-semibold tracking-tight text-white"
            >
              RigWise
            </a>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/"
                className="rounded-md border border-white/10 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
              >
                Main Site
              </a>
              <a
                href="#gpu-table"
                className="rounded-md bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
              >
                View Rankings
              </a>
            </div>
          </nav>

          <div className="grid gap-10 py-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(420px,1.1fr)] lg:items-center">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
                GPU Benchmark Lab
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-6xl">
                See what each GPU can pull before you buy.
              </h1>
              <p className="mt-6 text-lg leading-8 text-slate-300">
                A separate benchmark workspace for comparing graphics cards by
                resolution, workload, power draw, and value. The layout is ready
                for real benchmark data once the source model is decided.
              </p>
            </div>

            <div className="rounded-lg border border-white/10 bg-slate-900/70 p-5 shadow-2xl shadow-slate-950/40">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-cyan-300">
                    Benchmark Snapshot
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Placeholder layout
                  </p>
                </div>
                <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-100">
                  Data pending
                </span>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {metricCards.map((metric) => (
                  <div
                    key={metric.label}
                    className="rounded-md border border-white/10 bg-slate-950 p-4"
                  >
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {metric.label}
                    </p>
                    <p className="mt-3 text-3xl font-semibold text-white">
                      {metric.value}
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {metric.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="gpu-table" className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="rounded-lg border border-white/10 bg-slate-900/70 p-5 lg:sticky lg:top-6 lg:self-start">
              <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
                Filters
              </p>

              <div className="mt-6 space-y-6">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    Search GPU
                  </span>
                  <input
                    type="text"
                    placeholder="Search model or brand"
                    className="w-full rounded-md border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
                  />
                </label>

                <div>
                  <p className="mb-3 text-sm font-medium text-slate-200">
                    Workload
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {workloadTabs.map((workload) => (
                      <button
                        key={workload}
                        type="button"
                        className="rounded-md border border-white/10 bg-slate-950 px-3 py-2 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
                      >
                        {workload}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-200">
                    Resolution
                  </span>
                  <select className="w-full rounded-md border border-white/10 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20">
                    {resolutionFilters.map((resolution) => (
                      <option key={resolution}>{resolution}</option>
                    ))}
                  </select>
                </label>

                <label className="flex items-center justify-between gap-4 rounded-md border border-white/10 bg-slate-950 px-4 py-3">
                  <span className="text-sm font-medium text-slate-200">
                    Show value picks
                  </span>
                  <input
                    type="checkbox"
                    className="h-4 w-4 accent-cyan-300"
                  />
                </label>
              </div>
            </aside>

            <div className="space-y-6">
              <div className="rounded-lg border border-white/10 bg-slate-900/70 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
                      Rankings
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                      GPU Pull Benchmark
                    </h2>
                  </div>
                  <button
                    type="button"
                    className="rounded-md border border-white/10 bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/40 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
                  >
                    Compare Selected
                  </button>
                </div>

                <div className="mt-6 overflow-hidden rounded-lg border border-white/10">
                  <div className="overflow-x-auto">
                    <table className="min-w-[820px] w-full border-collapse text-left">
                      <thead className="bg-slate-950 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-4 py-3 font-semibold">GPU</th>
                          <th className="px-4 py-3 font-semibold">Tier</th>
                          <th className="px-4 py-3 font-semibold">
                            Target
                          </th>
                          <th className="px-4 py-3 font-semibold">
                            Avg FPS
                          </th>
                          <th className="px-4 py-3 font-semibold">
                            Ray Tracing
                          </th>
                          <th className="px-4 py-3 font-semibold">Power</th>
                          <th className="px-4 py-3 font-semibold">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/10 bg-slate-950/60">
                        {benchmarkRows.map((gpu) => (
                          <tr
                            key={gpu.name}
                            className="transition hover:bg-slate-900"
                          >
                            <td className="px-4 py-4">
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 accent-cyan-300"
                                  aria-label={`Select ${gpu.name}`}
                                />
                                <span className="font-semibold text-white">
                                  {gpu.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-slate-300">
                              {gpu.tier}
                            </td>
                            <td className="px-4 py-4 text-slate-300">
                              {gpu.resolution}
                            </td>
                            <td className="px-4 py-4 font-semibold text-white">
                              {gpu.fps}
                            </td>
                            <td className="px-4 py-4 text-slate-300">
                              {gpu.rayTracing}
                            </td>
                            <td className="px-4 py-4 text-slate-300">
                              {gpu.power}
                            </td>
                            <td className="px-4 py-4 text-slate-300">
                              {gpu.value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="grid gap-5 md:grid-cols-3">
                {['Top Performer', 'Best Value', 'Lowest Power'].map(
                  (title) => (
                    <article
                      key={title}
                      className="rounded-lg border border-white/10 bg-slate-900/70 p-5"
                    >
                      <p className="text-sm font-semibold text-cyan-300">
                        {title}
                      </p>
                      <p className="mt-4 text-2xl font-semibold text-white">
                        TBD
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-400">
                        Reserved for sourced benchmark results.
                      </p>
                    </article>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default GpuBenchmarks;

import UpgradePlanner from './components/UpgradePlanner';
import PartsBrowser from './components/PartsBrowser';
import AppStatus from './components/AppStatus';
import ComponentExplainer from './components/ComponentExplainer';
import GpuNamingGuide from './components/GpuNamingGuide';
import pcHeroRender from './assets/pc-hero-render.png';

const featureCards = [
  {
    title: 'Plan smarter upgrades',
    description:
      'Start with your current build and budget to get a focused upgrade direction.',
    graphic: 'cpu',
  },
  {
    title: 'Compare parts instantly',
    description:
      'Keep up to three parts side by side while you weigh price and performance.',
    graphic: 'gpu',
  },
  {
    title: 'Find better value',
    description:
      'Sort and scan parts by value so strong deals are easier to spot.',
    graphic: 'value',
  },
];

type FeatureGraphic = (typeof featureCards)[number]['graphic'];

function FeatureIcon({ type }: { type: FeatureGraphic }) {
  if (type === 'gpu') {
    return (
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="h-12 w-12 text-cyan-200"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      >
        <rect x="10" y="18" width="38" height="28" rx="4" />
        <path d="M48 25h6v14h-6M16 46v6M24 46v6M32 46v6M40 46v6" />
        <circle cx="28" cy="32" r="8" />
        <path d="M28 24v16M20 32h16" />
      </svg>
    );
  }

  if (type === 'value') {
    return (
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className="h-12 w-12 text-emerald-200"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      >
        <path d="M12 46h40M18 40l10-10 8 7 12-17" />
        <path d="M42 20h6v6" />
        <rect x="12" y="14" width="40" height="38" rx="6" />
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className="h-12 w-12 text-cyan-200"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="3"
    >
      <rect x="18" y="18" width="28" height="28" rx="5" />
      <rect x="25" y="25" width="14" height="14" rx="3" />
      <path d="M18 10v8M26 10v8M38 10v8M46 10v8M18 46v8M26 46v8M38 46v8M46 46v8M10 18h8M10 26h8M10 38h8M10 46h8M46 18h8M46 26h8M46 38h8M46 46h8" />
    </svg>
  );
}

function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="border-b border-white/10">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-10">
          <div className="flex justify-end">
            <AppStatus />
          </div>

          <div className="mt-16 grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)]">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-200">
                PC Upgrade Planning
              </span>
              <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white sm:text-6xl">
                RigWise
              </h1>
              <p className="mt-4 text-2xl text-slate-200">
                Smarter PC upgrades, better value.
              </p>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                RigWise helps you choose the best PC upgrade path by considering
                your current build, your budget, and what you actually want to
                do with your machine.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href="#upgrade-planner"
                  className="inline-flex items-center rounded-md bg-cyan-400 px-5 py-3 text-base font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
                >
                  Start Planning
                </a>
                <a
                  href="#component-guide"
                  className="inline-flex items-center rounded-md border border-white/10 bg-slate-900 px-5 py-3 text-base font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
                >
                  Learn PC Parts
                </a>
                <a
                  href="#gpu-naming-guide"
                  className="inline-flex items-center rounded-md border border-white/10 bg-slate-900 px-5 py-3 text-base font-semibold text-slate-100 transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-300/20"
                >
                  Decode GPU Names
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-lg border border-cyan-300/10 bg-cyan-300/5 blur-2xl" />
              <img
                src={pcHeroRender}
                alt="Modern custom PC build with visible components and subtle lighting"
                className="relative aspect-[16/10] w-full rounded-lg border border-white/10 object-cover shadow-2xl shadow-cyan-950/30"
              />
              <div className="absolute bottom-4 left-4 rounded-md border border-white/10 bg-slate-950/80 px-4 py-3 backdrop-blur">
                <p className="text-xs font-semibold uppercase tracking-wide text-cyan-300">
                  Component-focused
                </p>
                <p className="mt-1 text-sm text-slate-100">
                  CPU, GPU, power, and value all in one flow
                </p>
              </div>
            </div>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {featureCards.map((feature) => (
              <article
                key={feature.title}
                className="rounded-lg border border-white/10 bg-slate-900/70 p-5 transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-slate-900"
              >
                <FeatureIcon type={feature.graphic} />
                <h2 className="text-lg font-semibold text-white">
                  {feature.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-300">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <ComponentExplainer />
      <GpuNamingGuide />
      <UpgradePlanner />
      <PartsBrowser />
    </main>
  );
}

export default App;

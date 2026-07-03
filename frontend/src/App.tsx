import UpgradePlanner from './components/UpgradePlanner';
import PartsBrowser from './components/PartsBrowser';
import AppStatus from './components/AppStatus';

const featureCards = [
  {
    title: 'Plan smarter upgrades',
    description:
      'Start with your current build and budget to get a focused upgrade direction.',
  },
  {
    title: 'Compare parts instantly',
    description:
      'Keep up to three parts side by side while you weigh price and performance.',
  },
  {
    title: 'Find better value',
    description:
      'Sort and scan parts by value so strong deals are easier to spot.',
  },
];

function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="border-b border-white/10">
        <div className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 py-10">
          <div className="flex justify-end">
            <AppStatus />
          </div>

          <div className="mt-16 max-w-3xl">
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
              your current build, your budget, and what you actually want to do
              with your machine.
            </p>
            <a
              href="#upgrade-planner"
              className="mt-10 inline-flex items-center rounded-md bg-cyan-400 px-5 py-3 text-base font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Start Planning
            </a>
          </div>

          <div className="mt-16 grid gap-4 md:grid-cols-3">
            {featureCards.map((feature) => (
              <article
                key={feature.title}
                className="rounded-lg border border-white/10 bg-slate-900/70 p-5 transition hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-slate-900"
              >
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

      <UpgradePlanner />
      <PartsBrowser />
    </main>
  );
}

export default App;

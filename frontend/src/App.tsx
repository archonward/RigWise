function App() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
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
            RigWise helps you choose the best PC upgrade path by considering your
            current build, your budget, and what you actually want to do with
            your machine.
          </p>
          <button
            type="button"
            className="mt-10 inline-flex items-center rounded-md bg-cyan-400 px-5 py-3 text-base font-semibold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            Start Planning
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;

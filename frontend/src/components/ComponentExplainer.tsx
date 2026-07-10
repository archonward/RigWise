const componentGuides = [
  {
    name: 'CPU',
    role: 'The main processor that handles instructions and keeps the PC responsive.',
    builderTip:
      'Match the CPU to your motherboard socket and choose stronger CPUs for gaming, streaming, compiling, or editing.',
  },
  {
    name: 'GPU',
    role: 'The graphics card renders games, video previews, 3D work, and anything visual that needs heavy processing.',
    builderTip:
      'For gaming, this is usually the biggest performance driver. Check case clearance and power requirements before buying.',
  },
  {
    name: 'Motherboard',
    role: 'The main circuit board that connects the CPU, RAM, storage, GPU, fans, and ports together.',
    builderTip:
      'Pick one with the right CPU socket, RAM type, size, and enough slots for your storage and expansion needs.',
  },
  {
    name: 'RAM',
    role: 'Short-term memory the PC uses to keep active apps, browser tabs, games, and projects ready to access quickly.',
    builderTip:
      '16GB is a common starting point for gaming and general use, while 32GB helps heavier multitasking and creative work.',
  },
  {
    name: 'Storage',
    role: 'Where Windows, apps, games, and files live when the PC is powered off.',
    builderTip:
      'An SSD makes the whole system feel faster. Use larger drives if you keep many games, videos, or project files.',
  },
  {
    name: 'PSU',
    role: 'The power supply converts wall power into stable power for every component in the PC.',
    builderTip:
      'Choose enough wattage for the CPU and GPU, then leave headroom for upgrades. Quality matters here.',
  },
  {
    name: 'Case',
    role: 'The chassis that holds the parts, manages airflow, and determines what component sizes will fit.',
    builderTip:
      'Check motherboard size, GPU length, cooler height, radiator support, and how many fans it can mount.',
  },
  {
    name: 'Cooler',
    role: 'Moves heat away from the CPU so performance stays stable and the system does not overheat.',
    builderTip:
      'Use a cooler rated for your CPU, and make sure it fits your case and does not block tall RAM sticks.',
  },
];

function ComponentExplainer() {
  return (
    <section
      id="component-guide"
      className="border-t border-white/10 bg-slate-950 py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
            Builder Basics
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            What Each PC Part Does
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            A quick reference for new builders before choosing parts or planning
            an upgrade.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {componentGuides.map((component) => (
            <article
              key={component.name}
              className="rounded-lg border border-white/10 bg-slate-900/70 p-5"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-cyan-300/20 bg-cyan-300/10 text-sm font-bold text-cyan-100">
                  {component.name}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {component.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {component.role}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-md border border-white/10 bg-slate-950/70 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Builder tip
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-200">
                  {component.builderTip}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ComponentExplainer;

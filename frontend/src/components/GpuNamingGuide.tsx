const nvidiaNameParts = [
  {
    label: 'RTX',
    meaning: 'GeForce gaming GPU with NVIDIA RTX features such as ray tracing and DLSS.',
  },
  {
    label: '50',
    meaning: 'Generation. In RTX 5060, 50 means it belongs to the RTX 50 series.',
  },
  {
    label: '60',
    meaning: 'Performance class. 60 is mainstream, 70 is faster, 80 is high-end, and 90 is flagship.',
  },
  {
    label: 'Ti',
    meaning: 'A stronger version of the same class, usually sitting above the non-Ti card.',
  },
];

const amdNameParts = [
  {
    label: 'RX',
    meaning: 'Radeon gaming GPU. This is AMD\'s desktop graphics card branding.',
  },
  {
    label: '90',
    meaning: 'Generation. In RX 9070 XT, 90 means it belongs to the Radeon RX 9000 series.',
  },
  {
    label: '70',
    meaning: 'Performance class. 60 is mainstream, while 70 is the faster upper-mainstream tier.',
  },
  {
    label: 'XT',
    meaning: 'A faster version of the same class, similar to how Ti works on NVIDIA cards.',
  },
];

const tierExamples = [
  {
    tier: '50 class',
    nvidia: 'RTX 5050',
    amd: 'Often entry-level or budget when available',
    psu: '450W to 550W',
    note: 'Lowest current generation tier. Good for basic gaming targets.',
  },
  {
    tier: '60 class',
    nvidia: 'RTX 5060 / 5060 Ti',
    amd: 'RX 9060 / 9060 XT',
    psu: '550W is often enough; use 600W for stronger variants',
    note: 'Mainstream gaming tier. The Ti or XT suffix usually means a stronger version.',
  },
  {
    tier: '70 class',
    nvidia: 'RTX 5070 / 5070 Ti',
    amd: 'RX 9070 / 9070 XT',
    psu: '650W to 750W',
    note: 'Higher performance tier for stronger 1440p or lighter 4K builds.',
  },
  {
    tier: '80 and 90 class',
    nvidia: 'RTX 5080 / 5090',
    amd: 'Varies by generation',
    psu: '850W to 1000W or more',
    note: 'High-end and flagship cards. These usually draw more power and cost much more.',
  },
];

function GpuNameBreakdown({
  brand,
  example,
  parts,
}: {
  brand: string;
  example: string;
  parts: typeof nvidiaNameParts;
}) {
  return (
    <article className="rounded-lg border border-white/10 bg-slate-950 p-6 shadow-lg shadow-slate-950/20">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
            {brand}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">
            {example}
          </h3>
        </div>
        <span className="rounded-md border border-cyan-300/20 bg-cyan-300/10 px-3 py-2 text-sm font-semibold text-cyan-100">
          Name Decoder
        </span>
      </div>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2">
        {parts.map((part) => (
          <div
            key={part.label}
            className="rounded-md border border-white/10 bg-slate-900/80 p-4"
          >
            <dt className="text-xl font-semibold text-white">{part.label}</dt>
            <dd className="mt-2 text-sm leading-6 text-slate-300">
              {part.meaning}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}

function GpuNamingGuide() {
  return (
    <section
      id="gpu-naming-guide"
      className="border-t border-white/10 bg-slate-900/70 py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
            GPU Naming
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            How NVIDIA and AMD GPU Names Work
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-300">
            GPU names usually tell you the brand, generation, performance tier,
            whether it is a faster variant, and the rough power supply class to
            plan around. Use the name as a quick guide, then compare benchmarks
            and exact card requirements before buying.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          <GpuNameBreakdown
            brand="NVIDIA GeForce"
            example="RTX 5060 Ti"
            parts={nvidiaNameParts}
          />
          <GpuNameBreakdown
            brand="AMD Radeon"
            example="RX 9070 XT"
            parts={amdNameParts}
          />
        </div>

        <div className="mt-10 rounded-lg border border-white/10 bg-slate-950/70 p-5">
          <h3 className="text-xl font-semibold text-white">
            Common Desktop GPU Tiers
          </h3>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[860px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-3 pr-4 font-semibold">Tier</th>
                  <th className="py-3 pr-4 font-semibold">NVIDIA example</th>
                  <th className="py-3 pr-4 font-semibold">AMD example</th>
                  <th className="py-3 pr-4 font-semibold">Suggested PSU</th>
                  <th className="py-3 font-semibold">What it usually means</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-slate-300">
                {tierExamples.map((tier) => (
                  <tr key={tier.tier}>
                    <td className="py-4 pr-4 font-semibold text-white">
                      {tier.tier}
                    </td>
                    <td className="py-4 pr-4">{tier.nvidia}</td>
                    <td className="py-4 pr-4">{tier.amd}</td>
                    <td className="py-4 pr-4 font-semibold text-cyan-100">
                      {tier.psu}
                    </td>
                    <td className="py-4">{tier.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-slate-950/70 p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
              Suffixes
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Ti on NVIDIA and XT on AMD usually means a faster version of the
              base card. Super and GRE can also appear as special refresh or
              regional variants.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-950/70 p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
              Generation
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Newer generations often improve efficiency and features, but a
              newer 60-class card is not automatically faster than an older
              80-class card.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 bg-slate-950/70 p-5">
            <p className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
              Power Supply
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              Use the wattage table as a starting point. The exact requirement
              depends on the GPU model, CPU power draw, connector type, and PSU
              quality.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GpuNamingGuide;

import { useEffect, useState } from 'react';
import CompareTray from './CompareTray';
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

const sortOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Price: Low to High', value: 'price-low-high' },
  { label: 'Price: High to Low', value: 'price-high-low' },
  { label: 'Performance: High to Low', value: 'performance-high-low' },
  { label: 'Best Value', value: 'best-value' },
] as const;

type SortOption = (typeof sortOptions)[number]['value'];

interface PartGroup {
  key: string;
  title: string;
  description: string;
  parts: Part[];
}

const compareStorageKey = 'rigwise.compareParts';
const searchStorageKey = 'rigwise.partsSearch';
const categoryStorageKey = 'rigwise.partsCategory';
const sortStorageKey = 'rigwise.partsSort';

function getStoredValue(key: string, fallbackValue: string) {
  if (typeof window === 'undefined') {
    return fallbackValue;
  }

  return window.localStorage.getItem(key) ?? fallbackValue;
}

function getStoredSortOption() {
  const storedSort = getStoredValue(sortStorageKey, 'default');
  return sortOptions.some((option) => option.value === storedSort)
    ? (storedSort as SortOption)
    : 'default';
}

function getStoredCompareParts() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const storedParts = window.localStorage.getItem(compareStorageKey);
    return storedParts ? (JSON.parse(storedParts) as Part[]) : [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

function getValueScore(part: Part) {
  return part.price > 0 ? part.performanceScore / part.price : 0;
}

function getValueBadges(part: Part) {
  const badges: string[] = [];

  if (part.price < 200) {
    badges.push('Budget Pick');
  }

  if (part.performanceScore >= 90) {
    badges.push('High Performance');
  }

  if (getValueScore(part) >= 0.18) {
    badges.push('Great Value');
  }

  return badges;
}

function sortParts(parts: Part[], selectedSort: SortOption) {
  const sortedParts = [...parts];

  if (selectedSort === 'price-low-high') {
    return sortedParts.sort((firstPart, secondPart) => firstPart.price - secondPart.price);
  }

  if (selectedSort === 'price-high-low') {
    return sortedParts.sort((firstPart, secondPart) => secondPart.price - firstPart.price);
  }

  if (selectedSort === 'performance-high-low') {
    return sortedParts.sort(
      (firstPart, secondPart) =>
        secondPart.performanceScore - firstPart.performanceScore,
    );
  }

  if (selectedSort === 'best-value') {
    return sortedParts.sort(
      (firstPart, secondPart) =>
        getValueScore(secondPart) - getValueScore(firstPart),
    );
  }

  return sortedParts;
}

function getGpuGroup(part: Part) {
  if (part.performanceScore >= 95) {
    return {
      key: 'gpu-flagship',
      title: 'Flagship 4K GPUs',
      description: 'Top-end graphics cards for 4K, ray tracing, and heavy creator workloads.',
    };
  }

  if (part.performanceScore >= 84) {
    return {
      key: 'gpu-high-end',
      title: 'High-End 1440p and 4K GPUs',
      description: 'Fast cards for premium 1440p builds and capable 4K gaming.',
    };
  }

  if (part.performanceScore >= 68) {
    return {
      key: 'gpu-mainstream',
      title: 'Mainstream 1080p and 1440p GPUs',
      description: 'Balanced graphics cards for most gaming builds.',
    };
  }

  return {
    key: 'gpu-entry',
    title: 'Entry 1080p GPUs',
    description: 'Lower-cost cards for lighter games, esports, and budget upgrades.',
  };
}

function getPsuWattage(part: Part) {
  const wattageMatch = part.name.match(/(\d{3,4})\s*W?/i);
  return wattageMatch ? Number(wattageMatch[1]) : null;
}

function getCategoryGroup(part: Part) {
  return {
    key: part.category,
    title: `${part.category}s`,
    description: `All ${part.category.toLowerCase()} parts matching the current filters.`,
  };
}

function getSpecificPartGroup(part: Part) {
  if (part.category === 'CPU') {
    const socket = part.socket ?? 'Other';
    return {
      key: `cpu-${socket}`,
      title: `${socket} CPUs`,
      description:
        socket === 'AM4'
          ? 'DDR4 Ryzen upgrade options for older AMD systems.'
          : socket === 'AM5'
            ? 'Modern DDR5 Ryzen CPUs with a stronger future upgrade path.'
            : socket === 'LGA1700'
              ? 'Intel 12th to 14th gen desktop CPUs.'
              : socket === 'LGA1851'
                ? 'Intel Core Ultra desktop CPUs for newer boards.'
                : 'CPUs grouped by platform compatibility.',
    };
  }

  if (part.category === 'GPU') {
    return getGpuGroup(part);
  }

  if (part.category === 'RAM') {
    const memoryType = part.memoryType ?? 'Other';
    return {
      key: `ram-${memoryType}`,
      title: `${memoryType} Memory Kits`,
      description:
        memoryType === 'DDR5'
          ? 'Modern memory for current AMD and Intel platforms.'
          : memoryType === 'DDR4'
            ? 'Affordable memory for older or budget-friendly platforms.'
            : 'Memory grouped by compatibility type.',
    };
  }

  if (part.category === 'Motherboard') {
    const socket = part.socket ?? 'Other';
    return {
      key: `motherboard-${socket}`,
      title: `${socket} Motherboards`,
      description: 'Boards grouped by CPU socket so compatibility is easier to scan.',
    };
  }

  if (part.category === 'PSU') {
    const wattage = getPsuWattage(part);

    if (wattage !== null && wattage >= 850) {
      return {
        key: 'psu-high-end',
        title: '850W and Higher PSUs',
        description: 'Power supplies for premium GPUs, flagship builds, or extra upgrade headroom.',
      };
    }

    if (wattage !== null && wattage >= 700) {
      return {
        key: 'psu-upper',
        title: '700W to 799W PSUs',
        description: 'Good fit for upper-midrange single-GPU gaming systems.',
      };
    }

    return {
      key: 'psu-mainstream',
      title: '550W to 650W PSUs',
      description: 'Efficient options for entry and mainstream gaming builds.',
    };
  }

  if (part.category === 'Storage') {
    const storageType = part.memoryType ?? 'Other';
    return {
      key: `storage-${storageType}`,
      title: `${storageType} Storage`,
      description:
        storageType === 'NVMe'
          ? 'Fast SSDs for Windows, apps, and active game libraries.'
          : storageType === 'HDD'
            ? 'Large lower-cost drives for media, backups, and bulk storage.'
            : 'Storage grouped by drive type.',
    };
  }

  if (part.category === 'Case') {
    const isCompact = /itx|compact|small form/i.test(`${part.name} ${part.notes}`);
    return {
      key: isCompact ? 'case-compact' : 'case-mid-tower',
      title: isCompact ? 'Compact Cases' : 'Mid-Tower Airflow Cases',
      description: isCompact
        ? 'Smaller cases where motherboard size, cooler height, and GPU length matter more.'
        : 'General-purpose cases with airflow and space for mainstream builds.',
    };
  }

  if (part.category === 'Cooler') {
    const isLiquid = /liquid|aio|h100i/i.test(`${part.name} ${part.notes}`);
    return {
      key: isLiquid ? 'cooler-liquid' : 'cooler-air',
      title: isLiquid ? 'Liquid AIO Coolers' : 'Air Coolers',
      description: isLiquid
        ? 'Radiator-based coolers for stronger CPUs and cleaner socket clearance.'
        : 'Tower air coolers ranging from budget upgrades to premium quiet cooling.',
    };
  }

  return getCategoryGroup(part);
}

function getGroupedParts(parts: Part[], selectedCategory: string) {
  const groups = new Map<string, PartGroup>();

  parts.forEach((part) => {
    const groupInfo =
      selectedCategory === 'All' ? getCategoryGroup(part) : getSpecificPartGroup(part);
    const existingGroup = groups.get(groupInfo.key);

    if (existingGroup) {
      existingGroup.parts.push(part);
      return;
    }

    groups.set(groupInfo.key, {
      ...groupInfo,
      parts: [part],
    });
  });

  return Array.from(groups.values());
}

function getAveragePrice(parts: Part[]) {
  if (parts.length === 0) {
    return 0;
  }

  const totalPrice = parts.reduce((sum, part) => sum + part.price, 0);
  return Math.round(totalPrice / parts.length);
}

function PartCard({
  part,
  isSelectedForCompare,
  onToggleCompare,
}: {
  part: Part;
  isSelectedForCompare: boolean;
  onToggleCompare: (part: Part) => void;
}) {
  const badges = getValueBadges(part);

  return (
    <article className="rounded-lg border border-white/10 bg-slate-950 p-6 shadow-lg shadow-slate-950/20 transition hover:-translate-y-1 hover:border-cyan-300/40 hover:shadow-cyan-950/30">
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

      {badges.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-100"
            >
              {badge}
            </span>
          ))}
        </div>
      ) : null}

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

      <button
        type="button"
        onClick={() => onToggleCompare(part)}
        className={`mt-6 w-full rounded-md px-4 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-cyan-300/20 ${
          isSelectedForCompare
            ? 'border border-cyan-300/40 bg-cyan-300/10 text-cyan-100 hover:bg-cyan-300/20'
            : 'border border-white/10 bg-slate-900 text-slate-100 hover:border-cyan-300/40 hover:bg-slate-800'
        }`}
      >
        {isSelectedForCompare ? 'Remove from Compare' : 'Add to Compare'}
      </button>
    </article>
  );
}

function PartsBrowser() {
  const [parts, setParts] = useState<Part[]>([]);
  const [searchText, setSearchText] = useState(() =>
    getStoredValue(searchStorageKey, ''),
  );
  const [selectedCategory, setSelectedCategory] = useState(() =>
    getStoredValue(categoryStorageKey, 'All'),
  );
  const [selectedSort, setSelectedSort] = useState<SortOption>(() =>
    getStoredSortOption(),
  );
  const [selectedCompareParts, setSelectedCompareParts] = useState<Part[]>(() =>
    getStoredCompareParts(),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [compareMessage, setCompareMessage] = useState('');

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

  useEffect(() => {
    window.localStorage.setItem(searchStorageKey, searchText);
  }, [searchText]);

  useEffect(() => {
    window.localStorage.setItem(categoryStorageKey, selectedCategory);
  }, [selectedCategory]);

  useEffect(() => {
    window.localStorage.setItem(sortStorageKey, selectedSort);
  }, [selectedSort]);

  useEffect(() => {
    window.localStorage.setItem(
      compareStorageKey,
      JSON.stringify(selectedCompareParts),
    );
  }, [selectedCompareParts]);

  function clearFilters() {
    setSearchText('');
    setSelectedCategory('All');
    setSelectedSort('default');
  }

  function toggleComparePart(part: Part) {
    setCompareMessage('');

    const isAlreadySelected = selectedCompareParts.some(
      (selectedPart) => selectedPart.id === part.id,
    );

    if (isAlreadySelected) {
      setSelectedCompareParts((currentParts) =>
        currentParts.filter((selectedPart) => selectedPart.id !== part.id),
      );
      return;
    }

    if (selectedCompareParts.length >= 3) {
      setCompareMessage('You can compare up to 3 parts at a time.');
      return;
    }

    setSelectedCompareParts((currentParts) => [...currentParts, part]);
  }

  function removeComparePart(partId: number) {
    setCompareMessage('');
    setSelectedCompareParts((currentParts) =>
      currentParts.filter((part) => part.id !== partId),
    );
  }

  function clearCompareParts() {
    setCompareMessage('');
    setSelectedCompareParts([]);
  }

  const sortedParts = sortParts(parts, selectedSort);
  const groupedParts = getGroupedParts(sortedParts, selectedCategory);

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

        <div className="mt-10 grid gap-4 rounded-lg border border-white/10 bg-slate-950/70 p-4 lg:grid-cols-[minmax(0,1fr)_180px_220px_auto]">
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

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-200">
              Sort
            </span>
            <select
              value={selectedSort}
              onChange={(event) =>
                setSelectedSort(event.target.value as SortOption)
              }
              className="w-full rounded-md border border-white/10 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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

        <CompareTray
          selectedParts={selectedCompareParts}
          onRemovePart={removeComparePart}
          onClearCompare={clearCompareParts}
        />

        {compareMessage ? (
          <div className="mt-4 rounded-md border border-amber-300/30 bg-amber-300/10 p-4 text-sm font-medium text-amber-100">
            {compareMessage}
          </div>
        ) : null}

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
            <div className="space-y-8">
              {groupedParts.map((group) => (
                <section
                  key={group.key}
                  aria-labelledby={`parts-group-${group.key}`}
                  className="rounded-lg border border-white/10 bg-slate-950/60 p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="max-w-2xl">
                      <h3
                        id={`parts-group-${group.key}`}
                        className="text-2xl font-semibold text-white"
                      >
                        {group.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        {group.description}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm sm:min-w-[220px]">
                      <div className="rounded-md border border-white/10 bg-slate-900 px-3 py-2">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Parts
                        </p>
                        <p className="mt-1 font-semibold text-white">
                          {group.parts.length}
                        </p>
                      </div>
                      <div className="rounded-md border border-white/10 bg-slate-900 px-3 py-2">
                        <p className="text-xs uppercase tracking-wide text-slate-500">
                          Avg price
                        </p>
                        <p className="mt-1 font-semibold text-white">
                          ${getAveragePrice(group.parts)}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {group.parts.map((part) => {
                      const isSelectedForCompare = selectedCompareParts.some(
                        (selectedPart) => selectedPart.id === part.id,
                      );

                      return (
                        <PartCard
                          key={part.id}
                          part={part}
                          isSelectedForCompare={isSelectedForCompare}
                          onToggleCompare={toggleComparePart}
                        />
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export default PartsBrowser;

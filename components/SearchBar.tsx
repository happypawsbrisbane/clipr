interface SearchBarProps {
  defaultValue?: string;
}

export function SearchBar({ defaultValue = '' }: SearchBarProps) {
  return (
    <form action="/search" method="get" role="search" className="w-full">
      <label htmlFor="store-search" className="sr-only">
        Search Australian stores
      </label>
      <div className="flex w-full gap-2">
        <input
          id="store-search"
          name="q"
          type="search"
          defaultValue={defaultValue}
          placeholder="Search a store, e.g. JB Hi-Fi"
          autoComplete="off"
          className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-base shadow-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="submit"
          className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          Search
        </button>
      </div>
    </form>
  );
}

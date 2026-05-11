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
          className="w-full border border-hairline bg-paper px-3.5 py-2.5 font-sans text-base text-ink placeholder:text-mute focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
        <button
          type="submit"
          className="bg-ink px-5 py-2.5 font-sans text-sm font-medium text-paper transition hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-accent/40"
        >
          Search
        </button>
      </div>
    </form>
  );
}

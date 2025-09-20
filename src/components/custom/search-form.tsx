import __ from "@/lib/lang";

export default function SearchForm({
  searchChange,
  query,
}: {
  searchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  query: any;
}) {
  return (
    <input
      className="sm:col-span-10 col-span-12 h-10 mt-5 rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full"
      placeholder={__("Search")}
      onChange={searchChange}
      value={query.search}
    />
  );
}

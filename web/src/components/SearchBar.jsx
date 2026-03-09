import { FiSearch } from "react-icons/fi";

function SearchBar({ value, onChange }) {
  return (
    <div className="relative max-w-2xl mx-auto">
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-lg pointer-events-none" />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar por pieza o categorías..."
        className="
          w-full pl-11 pr-5 py-3.5
          bg-card border-2 border-border rounded-full
          font-sans text-sm text-text placeholder:text-muted
          transition-all duration-200
          focus:outline-none focus:border-gold focus:shadow-[0_0_0_3px_rgba(194,161,90,0.15)]
        "
      />
    </div>
  );
}

export default SearchBar;

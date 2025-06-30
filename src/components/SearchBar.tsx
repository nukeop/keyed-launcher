interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Type to search...',
  autoFocus = true,
}: SearchBarProps) {
  return (
    <div className="w-full border-b border-white/10">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent px-4 py-4 text-white placeholder-gray-400 focus:outline-none"
        autoFocus={autoFocus}
      />
    </div>
  );
}

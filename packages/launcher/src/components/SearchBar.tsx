import { ArrowLeft } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  onBackClick?: () => void;
}

export const SearchBar = ({
  value,
  onChange,
  placeholder = 'Type to search...',
  autoFocus = true,
  onBackClick,
}: SearchBarProps) => (
  <div className="w-full border-b border-white/10" data-testid="search-bar">
    <div className="flex items-center">
      {onBackClick && (
        <button
          onClick={onBackClick}
          className="flex ml-4 rounded active:bg-white/30 h-6 w-6 items-center justify-center text-gray-200 hover:bg-white/20 transition-colors bg-white/10"
          data-testid="back-button"
        >
          <ArrowLeft size={18} />
        </button>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 bg-transparent px-4 py-4 text-white placeholder-gray-400 focus:outline-none"
        autoFocus={autoFocus}
        data-testid="search-input"
      />
    </div>
  </div>
);

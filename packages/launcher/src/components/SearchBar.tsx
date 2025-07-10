import { ArrowLeft } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export function SearchBar({
  value,
  onChange,
  placeholder = 'Type to search...',
  autoFocus = true,
  showBackButton = false,
  onBackClick,
}: SearchBarProps) {
  return (
    <div className="w-full border-b border-white/10" data-testid="search-bar">
      <div className="flex items-center">
        {showBackButton && (
          <button
            onClick={onBackClick}
            className="flex h-10 w-10 items-center justify-center text-gray-400 transition-colors hover:text-white"
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
}

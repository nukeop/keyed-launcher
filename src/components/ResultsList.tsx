import { ResultItem } from './ResultItem';

export interface Result {
  id: string;
  title: string;
  subtitle?: string;
  icon?: string;
  action: () => void;
  shortcut?: string;
}

interface ResultsListProps {
  results: Result[];
  selectedIndex: number;
  onItemClick: (result: Result) => void;
  emptyMessage?: string;
}

export function ResultsList({
  results,
  selectedIndex,
  onItemClick,
  emptyMessage = 'No results found',
}: ResultsListProps) {
  if (results.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-gray-400 text-lg mb-2">🔍</div>
          <div className="text-gray-400">{emptyMessage}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {results.map((result, index) => (
        <ResultItem
          key={result.id}
          title={result.title}
          subtitle={result.subtitle}
          icon={result.icon}
          shortcut={result.shortcut}
          isSelected={index === selectedIndex}
          onClick={() => onItemClick(result)}
        />
      ))}
    </div>
  );
}

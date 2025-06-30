import { FC } from 'react';
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

export const ResultsList: FC<ResultsListProps> = ({
  results,
  selectedIndex,
  onItemClick,
  emptyMessage = 'No results found',
}) => {
  if (results.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center py-12">
        <div className="text-center">
          <div className="mb-2 text-lg text-gray-400">🔍</div>
          <div className="text-gray-400">{emptyMessage}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-1">
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
};

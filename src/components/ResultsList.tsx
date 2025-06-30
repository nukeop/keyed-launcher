import { FC } from 'react';
import { ResultItem } from './ResultItem';
import { CategoryHeader } from './CategoryHeader';
import { groupEntriesByCategory } from '../utils/categoryUtils';

export interface LauncherEntry {
  id: string;
  name: string;
  title: string;
  subtitle?: string;
  description: string;
  icon?: string;
  keywords?: string[];
  mode: 'view' | 'no-view' | 'background';
  category?: string;
  pluginId: string;
  action: () => void | Promise<void>;
  shortcut?: string;
}

// Keep Result as alias for backwards compatibility during transition
export type Result = LauncherEntry;

interface ResultsListProps {
  results: LauncherEntry[];
  selectedIndex: number;
  onItemClick: (result: LauncherEntry) => void;
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
      <div
        className="flex flex-1 items-center justify-center py-12"
        data-testid="empty-results"
      >
        <div className="text-center">
          <div className="mb-2 text-lg text-gray-400">🔍</div>
          <div className="text-gray-400">{emptyMessage}</div>
        </div>
      </div>
    );
  }

  const categoryGroups = groupEntriesByCategory(results);
  let globalIndex = 0;

  return (
    <div className="flex-1 overflow-y-auto px-1" data-testid="results-list">
      {categoryGroups.map((group) => (
        <div key={group.category}>
          <CategoryHeader
            title={group.category}
            data-testid="category-header"
          />
          {group.entries.map((result) => {
            const isSelected = globalIndex === selectedIndex;
            globalIndex++;

            return (
              <ResultItem
                data-testid={`result-item-${result.id}`}
                key={result.id}
                title={result.title}
                subtitle={result.subtitle}
                icon={result.icon}
                shortcut={result.shortcut}
                isSelected={isSelected}
                onClick={() => onItemClick(result)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

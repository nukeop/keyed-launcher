import { groupEntriesByCategory } from '../utils/categoryUtils';
import { CategoryHeader } from './CategoryHeader';
import { ItemKind, LauncherEntry, List } from '@keyed-launcher/plugin-sdk';
import { FC, useEffect, useRef } from 'react';

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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const selectedItemRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedItemRef.current && scrollContainerRef.current) {
      selectedItemRef.current.scrollIntoView({
        behavior: 'instant',
        block: 'nearest',
      });
    }
  }, [selectedIndex]);

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
    <div
      ref={scrollContainerRef}
      className="flex h-full flex-1 flex-col overflow-y-auto px-1"
      data-testid="results-list"
    >
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
              <List.Item
                ref={isSelected ? selectedItemRef : undefined}
                data-testid={`result-item-${result.id}`}
                key={result.id}
                title={result.title}
                subtitle={result.subtitle}
                kind={ItemKind.Application}
                icon={result.icon}
                isSelected={isSelected}
                onAction={() => onItemClick(result)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

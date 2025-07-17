import { useListKeyboardNavigation } from '../../hooks/useListKeyboardNavigation';
import { ItemKind, LauncherEntry } from '../../types';
import { groupEntriesByCategory } from '../../utils/categoryUtils';
import { CategoryHeader } from './CategoryHeader/CategoryHeader';
import { InlineItem } from './InlineItem/InlineItem';
import { Item } from './Item/Item';
import { SearchIcon } from 'lucide-react';
import { FC, useEffect, useRef } from 'react';

export type ListProps = {
  results: LauncherEntry[];
  onItemAction: (item: LauncherEntry) => void;
  'data-testid'?: string;
};

interface ListComponent extends FC<ListProps> {
  Item: typeof Item;
  CategoryHeader: typeof CategoryHeader;
  InlineItem: typeof InlineItem;
}

const ListBase: FC<ListProps> = ({
  results,
  onItemAction,
  'data-testid': testId,
}) => {
  const { selectedIndex } = useListKeyboardNavigation({
    results,
    onItemAction,
  });
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
          <div className="flex flex-row items-center justify-center mb-2 text-gray-400">
            <SearchIcon size={48} />
          </div>
          <div className="text-gray-400">No results</div>
        </div>
      </div>
    );
  }

  const categoryGroups = groupEntriesByCategory(results);

  let globalIndex = 0;

  return (
    <div
      ref={scrollContainerRef}
      className="flex h-full flex-1 flex-col overflow-y-auto px-2 py-2 my-2"
      data-testid={testId ?? 'plugin-list'}
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
                onAction={() => onItemAction(result)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};

export const List = ListBase as ListComponent;
List.Item = Item;
List.CategoryHeader = CategoryHeader;
List.InlineItem = InlineItem;

import { useSearchStore } from '../../stores/search';
import { EmptyView } from './EmptyView/EmptyView';
import { filterListChildren } from './filteringUtils';
import { Item } from './Item/Item';
import { ListContext, ListContextType } from './ListContext';
import { Section } from './Section/Section';
import { useListKeyboardNavigation } from './useListKeyboardNavigation';
import {
  Children,
  FC,
  isValidElement,
  ReactElement,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type ListChildren =
  | ReactElement<typeof Item>
  | ReactElement<typeof Section>
  | Array<ReactElement<typeof Item> | ReactElement<typeof Section>>;

export type ListProps = {
  children: ListChildren;
  filtering?: boolean;
  searchText?: string;
  onSearchTextChange?: (text: string) => void;
  isLoading?: boolean;
  selectedItemId?: string | null;
  onSelectionChange?: (id: string) => void;
  'data-testid'?: string;
};

interface ListComponent extends FC<ListProps> {
  Item: typeof Item;
  Section: typeof Section;
  EmptyView: typeof EmptyView;
}

function getOrderedItemIds(children: ReactNode): string[] {
  const ids: string[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.props.children) {
      ids.push(...getOrderedItemIds(child.props.children));
    }

    if (child.type === List.Item) {
      ids.push(child.props.id);
    }
  });

  return ids;
}

const InnerList: FC<{ children: ReactNode; 'data-testid'?: string }> = ({
  children,
  'data-testid': testId,
}) => {
  useListKeyboardNavigation();

  const childrenArray = Children.toArray(children);
  const isEmpty = childrenArray.length === 0;

  return (
    <div
      role="listbox"
      className="flex h-full flex-1 flex-col overflow-y-auto px-2 py-2 my-2"
      data-testid={testId ?? 'plugin-list'}
    >
      {isEmpty ? <EmptyView /> : children}
    </div>
  );
};

const ListBase: FC<ListProps> = ({
  children,
  filtering = true,
  searchText,
  onSearchTextChange,
  isLoading,
  selectedItemId,
  onSelectionChange,
  'data-testid': testId,
}) => {
  const { searchQuery, setSearchQuery, setIsLoading } = useSearchStore();
  const itemRefs = useRef(new Map<string, RefObject<HTMLElement>>());
  const filteredChildren = filtering
    ? filterListChildren(children, searchQuery)
    : children;
  const orderedItemIds = useMemo(
    () => getOrderedItemIds(filteredChildren),
    [filteredChildren],
  );
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
    null,
  );
  const selectedId = selectedItemId ?? internalSelectedId;

  useEffect(() => {
    useSearchStore.subscribe(({ searchQuery }) => {
      onSearchTextChange?.(searchQuery);
    });
  }, [onSearchTextChange]);

  useEffect(() => {
    if (searchText) {
      setSearchQuery(searchText);
    }
  }, [setSearchQuery, searchText]);

  useEffect(() => {
    if (selectedItemId !== undefined) {
      setInternalSelectedId(selectedItemId);
    } else if (internalSelectedId === null && orderedItemIds.length > 0) {
      setInternalSelectedId(orderedItemIds[0]);
    }
  }, [internalSelectedId, orderedItemIds, selectedItemId]);

  useEffect(() => {
    setInternalSelectedId(orderedItemIds[0]);
  }, [orderedItemIds, searchQuery]);

  useEffect(() => {
    if (isLoading !== undefined) {
      setIsLoading(isLoading);
    }
  }, [isLoading, setIsLoading]);

  const registerItem = useCallback(
    (id: string, ref: React.RefObject<HTMLElement>) => {
      itemRefs.current.set(id, ref);
    },
    [],
  );

  const unregisterItem = useCallback((id: string) => {
    itemRefs.current.delete(id);
  }, []);

  const getItemRef = useCallback((id: string) => itemRefs.current.get(id), []);

  const getIndex = useCallback(
    (id: string) => orderedItemIds.indexOf(id),
    [orderedItemIds],
  );

  const getIdByDelta = useCallback(
    (delta: number, withWraparound = true): string | null => {
      if (!selectedId) return null;
      const index = orderedItemIds.indexOf(selectedId);
      if (index === -1) return null;

      let next = index + delta;
      const len = orderedItemIds.length;

      if (withWraparound) {
        next = (next + len) % len;
      } else {
        if (next < 0 || next >= len) return null;
      }

      return orderedItemIds[next] ?? null;
    },
    [orderedItemIds, selectedId],
  );

  const setSelectedId = useCallback(
    (id: string) => {
      // Uncontrolled
      if (selectedItemId === undefined) {
        setInternalSelectedId(id);
      }

      // Controlled
      onSelectionChange?.(id);
    },
    [selectedItemId, onSelectionChange],
  );

  const onSelectedItemAction = () => {};

  const contextValue: ListContextType = {
    registerItem,
    unregisterItem,
    getItemRef,
    orderedItemIds,
    selectedId,
    setSelectedId,
    getIndex,
    getIdByDelta,
    onSelectedItemAction,
  };

  return (
    <ListContext.Provider value={contextValue}>
      <InnerList data-testid={testId}>{filteredChildren}</InnerList>
    </ListContext.Provider>
  );
};

export const List = ListBase as ListComponent;
List.Item = Item;
List.Section = Section;
List.EmptyView = EmptyView;

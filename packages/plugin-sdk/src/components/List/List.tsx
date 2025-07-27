import { InlineItem } from './InlineItem';
import { Item } from './Item/Item';
import { ListContext, ListContextType } from './ListContext';
import { Section } from './Section/Section';
import { useListKeyboardNavigation } from './useListKeyboardNavigation';
import {
  Children,
  FC,
  isValidElement,
  ReactNode,
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type ListProps = {
  children: ReactNode;
  filtering?: boolean;
  isLoading?: boolean;
  selectedItemId?: string | null;
  onSelectionChange: (id: string) => void;
  'data-testid'?: string;
};

interface ListComponent extends FC<ListProps> {
  Item: typeof Item;
  Section: typeof Section;
  InlineItem: typeof InlineItem;
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
  return (
    <div
      role="listbox"
      className="flex h-full flex-1 flex-col overflow-y-auto px-2 py-2 my-2"
      data-testid={testId ?? 'plugin-list'}
    >
      {children}
    </div>
  );
};

const ListBase: FC<ListProps> = ({
  children,
  filtering,
  isLoading,
  selectedItemId,
  onSelectionChange,
  'data-testid': testId,
}) => {
  const itemRefs = useRef(new Map<string, RefObject<HTMLElement>>());
  const orderedItemIds = useMemo(() => getOrderedItemIds(children), [children]);
  const [internalSelectedId, setInternalSelectedId] = useState<string | null>(
    null,
  );
  const selectedId = selectedItemId ?? internalSelectedId;

  useEffect(() => {
    if (selectedItemId !== undefined) {
      setInternalSelectedId(selectedItemId);
    } else if (internalSelectedId === null && orderedItemIds.length > 0) {
      setInternalSelectedId(orderedItemIds[0]);
    }
  }, [selectedItemId, orderedItemIds.join(',')]);

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
      <InnerList data-testid={testId}>{children}</InnerList>
    </ListContext.Provider>
  );
};

export const List = ListBase as ListComponent;
List.Item = Item;
List.Section = Section;
List.InlineItem = InlineItem;

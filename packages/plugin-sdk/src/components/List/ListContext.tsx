import { createContext, RefObject, useContext } from 'react';

export type ListContextType = {
  registerItem: (id: string, ref: RefObject<HTMLElement>) => void;
  unregisterItem: (id: string) => void;
  getItemRef: (id: string) => RefObject<HTMLElement> | undefined;
  orderedItemIds: string[];
  selectedId: string | null | undefined;
  setSelectedId: (id: string) => void;
  getIndex: (id: string) => number;
  getIdByDelta: (delta: number, withWraparound?: boolean) => string | null;
  onSelectedItemAction: () => void;
};

export const ListContext = createContext<ListContextType | null>(null);

export const useListContext = () => {
  const context = useContext(ListContext);
  if (!context) {
    throw new Error('useListContext must be used within a ListProvider');
  }
  return context;
};

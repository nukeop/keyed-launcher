import { useListContext } from './ListContext';
import { useEffect } from 'react';

export const useListKeyboardNavigation = () => {
  const { selectedId, setSelectedId, getIdByDelta } = useListContext();
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      event.preventDefault();
      let newId: string | null = null;
      switch (event.key) {
        case 'ArrowDown':
          newId = getIdByDelta(1, true);
          break;
        case 'ArrowUp':
          newId = getIdByDelta(-1, true);
          break;
        case 'PageDown':
          newId = getIdByDelta(10, true);
          break;
        case 'PageUp':
          newId = getIdByDelta(-10, true);
          break;
        case 'Enter':
          break;
      }
      newId && setSelectedId(newId);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [getIdByDelta, selectedId, setSelectedId]);
};

import { useListContext } from './ListContext';
import { useEffect } from 'react';

export const useListKeyboardNavigation = () => {
  const { selectedId, setSelectedId, getIdByDelta } = useListContext();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      let newId: string | null = null;
      switch (event.key) {
        case 'ArrowDown':
          newId = getIdByDelta(1);
          event.preventDefault();
          break;
        case 'ArrowUp':
          newId = getIdByDelta(-1);
          event.preventDefault();
          break;
        case 'PageDown':
          newId = getIdByDelta(10);
          event.preventDefault();
          break;
        case 'PageUp':
          newId = getIdByDelta(-10);
          event.preventDefault();
          break;
      }
      newId && setSelectedId(newId);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [getIdByDelta, selectedId, setSelectedId]);
};

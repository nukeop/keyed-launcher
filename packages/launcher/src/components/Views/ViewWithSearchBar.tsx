import { useLauncherStore } from '../../stores/launcher';
import { usePerformanceTracking } from '../../utils/usePerformanceTracking';
import { ActionBar } from '../ActionBar';
import { SearchBar } from '../SearchBar';
import { FC, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type ViewWithSearchBarProps = {
  'data-testid'?: string;
  children: React.ReactNode;
};

export const ViewWithSearchBar: FC<ViewWithSearchBarProps> = ({
  'data-testid': dataTestId,
  children,
}) => {
  const { searchQuery, setSearchQuery, hideWindow } = useLauncherStore();
  const location = useLocation();
  const isRoot = location.pathname === '/';
  const navigate = useNavigate();

  const { trackWindowHide } = usePerformanceTracking();
  const handleClose = useCallback(async () => {
    await trackWindowHide(hideWindow);
  }, [hideWindow, trackWindowHide]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          if (searchQuery.length > 0) {
            setSearchQuery('');
          } else if (!isRoot) {
            navigate(-1);
          } else {
            handleClose();
          }
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleClose, isRoot, navigate, searchQuery, setSearchQuery]);

  useEffect(() => {
    setSearchQuery('');
  }, [location, setSearchQuery]);

  return (
    <div className="flex h-full flex-1 flex-col" data-testid={dataTestId}>
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Type to search..."
        onBackClick={isRoot ? undefined : () => navigate('/')}
      />
      <div className="flex-1 overflow-y-hidden">{children}</div>
      <ActionBar icon="⚙️" />
    </div>
  );
};

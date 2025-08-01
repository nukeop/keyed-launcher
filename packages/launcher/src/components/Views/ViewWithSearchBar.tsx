import { useLauncherStore } from '../../stores/launcher';
import { usePerformanceTracking } from '../../utils/usePerformanceTracking';
import { ActionBar } from '../ActionBar/ActionBar';
import { SearchBar } from '../SearchBar';
import styles from './LoadingBar.module.css';
import { useSearchStore } from '@keyed-launcher/plugin-sdk';
import { FC, useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LoadingBar: FC = () => {
  return (
    <div className="h-px bg-gray-700 relative overflow-hidden">
      <div
        className={`absolute inset-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent w-1/3 opacity-80 ${styles['loading-sweep']}`}
      />
    </div>
  );
};

export type ViewWithSearchBarProps = {
  'data-testid'?: string;
  children: React.ReactNode;
};

export const ViewWithSearchBar: FC<ViewWithSearchBarProps> = ({
  'data-testid': dataTestId,
  children,
}) => {
  const { hideWindow } = useLauncherStore();
  const { searchQuery, setSearchQuery, isLoading } = useSearchStore();
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
      {isLoading ? <LoadingBar /> : <div className="h-px bg-gray-700" />}
      <div className="flex-1 overflow-y-hidden">{children}</div>
      <ActionBar icon="⚙️" />
    </div>
  );
};

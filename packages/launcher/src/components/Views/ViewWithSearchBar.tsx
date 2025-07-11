import { useLauncherStore } from '../../stores/launcher';
import { SearchBar } from '../SearchBar';
import { FC, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export type ViewWithSearchBarProps = {
  'data-testid'?: string;
  children: React.ReactNode;
};

export const ViewWithSearchBar: FC<ViewWithSearchBarProps> = ({
  'data-testid': dataTestId,
  children,
}) => {
  const { searchQuery, setSearchQuery } = useLauncherStore();
  const location = useLocation();
  const isRoot = location.pathname === '/';
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          event.preventDefault();
          searchQuery.length > 0 ? setSearchQuery('') : navigate(-1);
          break;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [navigate, searchQuery, setSearchQuery]);

  useEffect(() => {
    setSearchQuery('');
  }, [location]);

  return (
    <div className="flex h-full flex-1 flex-col" data-testid={dataTestId}>
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Type to search..."
        onBackClick={isRoot ? undefined : () => navigate('/')}
      />
      {children}
    </div>
  );
};

import { useLauncherStore } from '../../stores/launcher';
import { SearchBar } from '../SearchBar';
import { FC } from 'react';

export type ViewWithSearchBarProps = {
  'data-testid'?: string;
  children: React.ReactNode;
};

export const ViewWithSearchBar: FC<ViewWithSearchBarProps> = ({
  'data-testid': dataTestId,
  children,
}) => {
  const { searchQuery, setSearchQuery } = useLauncherStore();

  return (
    <div className="flex h-full flex-1 flex-col" data-testid={dataTestId}>
      <SearchBar
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Type to search..."
      />
      {children}
    </div>
  );
};

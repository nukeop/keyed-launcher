import { Search } from 'lucide-react';
import { FC } from 'react';

export const EmptyView: FC = () => (
  <div
    data-testid="empty-view"
    className="flex flex-col items-center justify-center h-full text-center py-12"
  >
    <div className="mb-6 relative">
      <div className="w-24 h-24 bg-gray-700/80 rounded-full flex items-center justify-center border border-gray-600/50">
        <Search className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
      </div>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500/70 rounded-full"></div>
      <div className="absolute -bottom-2 -left-2 w-2 h-2 bg-gray-400/80 rounded-full"></div>
    </div>
    <h3 className="text-lg font-medium text-gray-300 mb-2">No results</h3>
    <p className="text-sm text-gray-500">Try a different expression</p>
  </div>
);

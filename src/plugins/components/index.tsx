import React from 'react';

export interface ListProps {
  children: React.ReactNode;
}

export const List: React.FC<ListProps> = ({ children }) => {
  return <div className="flex flex-col space-y-1">{children}</div>;
};

export interface ListItemProps {
  title: string;
  subtitle?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}

export const ListItem: React.FC<ListItemProps> = ({
  title,
  subtitle,
  onClick,
  children,
}) => {
  return (
    <div
      className="cursor-pointer rounded p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
      onClick={onClick}
    >
      <div className="flex flex-col">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </div>
        {subtitle && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {subtitle}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export interface DetailProps {
  title: string;
  children: React.ReactNode;
}

export const Detail: React.FC<DetailProps> = ({ title, children }) => {
  return (
    <div className="p-4">
      <div className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
        {title}
      </div>
      <div className="text-gray-700 dark:text-gray-300">{children}</div>
    </div>
  );
};

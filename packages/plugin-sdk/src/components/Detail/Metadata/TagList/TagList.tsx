import { Item } from './Item';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface TagListProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

interface TagListComponent extends React.FC<TagListProps> {
  Item: typeof Item;
}

const TagListBase: React.FC<TagListProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <div className={twMerge('flex flex-col gap-2', className)}>
      <div className="text-xs font-medium text-gray-400">{title}</div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
};

export const TagList = TagListBase as TagListComponent;
TagList.Item = Item;

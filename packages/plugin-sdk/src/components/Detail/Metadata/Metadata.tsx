import { Label } from './Label';
import { Link } from './Link';
import { Separator } from './Separator';
import { TagList } from './TagList';
import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface MetadataProps {
  children?: React.ReactNode;
  className?: string;
}

interface MetadataComponent extends React.FC<MetadataProps> {
  Label: typeof Label;
  Link: typeof Link;
  TagList: typeof TagList;
  Separator: typeof Separator;
}

const MetadataBase: React.FC<MetadataProps> = ({
  children,
  className = '',
}) => {
  return (
    <div className={twMerge('flex flex-col gap-3', className)}>{children}</div>
  );
};

export const Metadata = MetadataBase as MetadataComponent;
Metadata.Label = Label;
Metadata.Link = Link;
Metadata.TagList = TagList;
Metadata.Separator = Separator;

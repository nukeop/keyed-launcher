import { Label } from './Label';
import { Link } from './Link';
import { Separator } from './Separator';
import { TagList } from './TagList';
import React, { FC } from 'react';
import { twMerge } from 'tailwind-merge';

export type MetadataProps = {
  children?: React.ReactNode;
  className?: string;
};

interface MetadataComponent extends FC<MetadataProps> {
  Label: typeof Label;
  Link: typeof Link;
  TagList: typeof TagList;
  Separator: typeof Separator;
}

const MetadataBase: FC<MetadataProps> = ({ children, className = '' }) => (
  <div className={twMerge('flex flex-col gap-3', className)}>{children}</div>
);

export const Metadata = MetadataBase as MetadataComponent;
Metadata.Label = Label;
Metadata.Link = Link;
Metadata.TagList = TagList;
Metadata.Separator = Separator;

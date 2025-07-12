import { Metadata } from './Metadata';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { twMerge } from 'tailwind-merge';

export interface DetailProps {
  markdown?: string;
  children?: React.ReactNode;
  className?: string;
}

interface DetailComponent extends React.FC<DetailProps> {
  Metadata: typeof Metadata;
}

const DetailBase: React.FC<DetailProps> = ({
  markdown = '',
  children,
  className = '',
}) => {
  return (
    <div className={twMerge('flex h-full gap-4', className)}>
      {children && (
        <div className="flex-none w-70 p-4 border-r border-gray-200 overflow-y-auto text-white">
          {children}
        </div>
      )}
      <div className="flex-1 p-4 overflow-y-auto prose prose-sm max-w-none">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
    </div>
  );
};

const Detail = DetailBase as DetailComponent;
Detail.Metadata = Metadata;

export default Detail;

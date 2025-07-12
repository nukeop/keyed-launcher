import { Metadata } from './Metadata';
import React, { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import { twMerge } from 'tailwind-merge';

export type DetailProps = {
  className?: string;
  markdown?: string;
  metadata?: React.ReactNode;
  isLoading?: boolean;
  navigationTitle?: string;
};

interface DetailComponent extends FC<DetailProps> {
  Metadata: typeof Metadata;
}

const DetailBase: FC<DetailProps> = ({
  className = '',
  markdown = '',
  metadata = null,
  isLoading = false,
  navigationTitle = '',
}) => {
  return (
    <div
      className={twMerge('flex flex-row h-full gap-4 text-white', className)}
    >
      <div className="flex-1 p-4 overflow-y-auto prose prose-sm max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h4:text-base prose-h5:text-sm prose-h6:text-xs prose-headings:text-white prose-headings:m-0 prose-p:text-gray-300 prose-strong:text-white prose-code:text-pink-400 prose-code:bg-gray-800 prose-pre:bg-gray-800 prose-a:text-blue-400 prose-pre:text-blue-400 prose-pre:py-2 prose-pre:prose-code:leading-2">
        <ReactMarkdown>{markdown}</ReactMarkdown>
      </div>
      {metadata && (
        <div className="flex-none w-70 p-4 border-l border-white/10 overflow-y-auto text-white">
          {metadata}
        </div>
      )}
    </div>
  );
};

export const Detail = DetailBase as DetailComponent;
Detail.Metadata = Metadata;
